// script1.js
document.addEventListener('DOMContentLoaded', () => {
  // First Column Logic
  document.querySelectorAll('#input-lang .tile').forEach(tile => {
      tile.addEventListener('click', function() {
          document.querySelector('#input-lang .active').classList.remove('active');
          this.classList.add('active');
      });
  });

  // Second Column Logic
  const alternatingMenu = document.querySelector('.alternating-menu');
  const options = document.querySelectorAll('.alternating-menu .option');
  options[0].classList.add('active');

  alternatingMenu.addEventListener('click', () => {
    const currentActive = document.querySelector('.alternating-menu .active');
    const otherOption = Array.from(options).find(opt => opt !== currentActive);
    
    currentActive.classList.remove('active');
    otherOption.classList.add('active');
    
    // Force reflow to enable transition
    void otherOption.offsetWidth;

      alternatingMenu.addEventListener('mouseenter', () => {
      alternatingMenu.classList.add('hover-active');
    });
    
      alternatingMenu.addEventListener('mouseleave', () => {
      alternatingMenu.classList.remove('hover-active');
    });
  });

  // Third Column Logic
  document.querySelectorAll('#output-lang .tile-image').forEach(tile => {
      tile.addEventListener('click', function() {
          document.querySelector('#output-lang .active').classList.remove('active');
          this.classList.add('active');
      });
  });

  // Confirm Button Logic
  document.querySelector('.confirm-btn').addEventListener('click', () => {
      // Get selected values
      const selections = {
          inputType: document.querySelector('#input-lang .active').textContent,
          conversionType: document.querySelector('.alternating-menu .active .overlay').textContent,
          outputLanguage: getOutputLanguage()
      };

      // Store in localStorage
      localStorage.setItem('translationSelections', JSON.stringify(selections));

      // Redirect based on conversion type
      if (selections.conversionType.includes('Word')) {
        window.location.href = 'http://localhost:8000/';  // Django Project 1
    } else if (selections.conversionType.includes('Sign')) {
        window.location.href = 'http://localhost:8001/';  // Django Project 2
    } else {
        alert("Please select a conversion type.");
    }
    
  });

  function getOutputLanguage() {
      const activeTile = document.querySelector('#output-lang .active');
      const bgImage = getComputedStyle(activeTile).backgroundImage;
      return bgImage.split('/').pop().replace('.jpeg"', '');
  }
});
