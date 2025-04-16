import cv2
import threading
import numpy as np
import joblib
import mediapipe as mp
from django.http import StreamingHttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from googletrans import Translator

# Load the ASL model
try:
    asl_model = joblib.load("sign_language_model.pkl")
except Exception as e:
    asl_model = None
    print(f"Error loading model: {e}")

# Initialize MediaPipe Holistic Model
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(
    static_image_mode=False,
    model_complexity=1,
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Global variables
cam = None
detected_sign = "Waiting..."
lock = threading.Lock()

def cam_init(w=640, h=480):
    global cam
    if cam is None or not cam.isOpened():
        cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        cam.set(cv2.CAP_PROP_FRAME_WIDTH, w)
        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, h)
        cam.set(cv2.CAP_PROP_FPS, 30)
        cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)

def process_frame(img):
    global detected_sign
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    res = holistic.process(img_rgb)

    def extract_hand_landmarks(hand_landmarks):
        if not hand_landmarks:
            return [0.0] * 63  # 21 landmarks × 3 coordinates
        return [coord for lm in hand_landmarks.landmark for coord in (lm.x, lm.y, lm.z)]

    left_hand = extract_hand_landmarks(res.left_hand_landmarks)
    right_hand = extract_hand_landmarks(res.right_hand_landmarks)

    points = left_hand + right_hand  # Total: 126 features

    if asl_model and len(points) == 126:
        detected_sign = asl_model.predict([points])[0]
    else:
        detected_sign = "Waiting..."

    img = cv2.resize(img, (480, 360))
    return img

def stream_frames():
    global cam
    cam_init()

    while cam and cam.isOpened():
        with lock:
            ok, frame = cam.read()
            if not ok:
                break
            frame = process_frame(frame)
            _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 65])

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')

def home(request):
    return render(request, "recognition/index.html")

def recognition(request):
    ua = request.headers.get('User-Agent', '').lower()
    cam_init(360, 270) if "mobi" in ua else cam_init(1280, 720)

    translated_text = ""

    if request.method == "POST" and request.POST.get("action") == "translate":
        text = request.POST.get("text", "")
        lang = request.POST.get("lang", "hi")
        translator = Translator()
        try:
            translated = translator.translate(text, dest=lang)
            translated_text = translated.text
        except Exception as e:
            translated_text = f"Error: {e}"

    return render(request, "recognition/recognition.html", {
        "translated_text": translated_text
    })

def video_feed(request):
    return StreamingHttpResponse(stream_frames(), content_type="multipart/x-mixed-replace; boundary=frame")

def get_sign(request):
    return JsonResponse({"sign": detected_sign})

@csrf_exempt
def stop_video(request):
    global cam
    if cam:
        with lock:
            cam.release()
            cam = None
            cv2.destroyAllWindows()
    return JsonResponse({}, status=204)
