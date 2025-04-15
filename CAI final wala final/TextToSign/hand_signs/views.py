from django.shortcuts import render
from .forms import StatementForm
from .models import HandSign

def convert_statement(request):
    if request.method == 'POST':
        form = StatementForm(request.POST)
        if form.is_valid():
            statement = form.cleaned_data['statement']
            # Process the statement to get hand signs
            hand_signs = get_hand_signs(statement)
            return render(request, 'hand_signs/result.html', {'hand_signs': hand_signs})
    else:
        form = StatementForm()
    return render(request, 'hand_signs/form.html', {'form': form})

def get_hand_signs(statement):
    # Split the statement into words and get corresponding hand signs
    words = statement.split()
    hand_signs = []
    for word in words:
        try:
            hand_sign = HandSign.objects.get(text=word)
            hand_signs.append(hand_sign)
        except HandSign.DoesNotExist:
            continue
    return hand_signs
from django.http import JsonResponse

def convert_statement(request):
    if request.method == 'POST':
        form = StatementForm(request.POST)
        if form.is_valid():
            statement = form.cleaned_data['statement']
            hand_signs = get_hand_signs(statement)
            # Prepare the data to return as JSON
            results = [{'text': hand_sign.text, 'image_url': hand_sign.image.url} for hand_sign in hand_signs]
            return JsonResponse({'hand_signs': results})
    else:
        form = StatementForm()
    return render(request, 'hand_signs/form.html', {'form': form})