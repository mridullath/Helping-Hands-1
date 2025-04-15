function quitApp() {
  fetch('/stop_video/', { method: 'POST' })  // ✅ Stop camera before redirect
    .then(() => {
      window.location.href = "/";  // ✅ Redirect only after stopping camera
    })
    .catch(error => console.error('Error:', error));
}

// Update Sign Meaning in Recognition Page
function updateSignMeaning(sign) {
  document.getElementById("signMeaning").innerText = sign;
}

// Fetch detected sign every second
setInterval(() => {
  fetch("/get_sign")
      .then(response => response.json())
      .then(data => updateSignMeaning(data.sign))
      .catch(error => console.error('Error:', error));
}, 1000);
