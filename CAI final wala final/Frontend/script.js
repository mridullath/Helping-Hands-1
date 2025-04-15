document.addEventListener("DOMContentLoaded", function () {
  // Dark Mode Functionality
  const darkModeButton = document.getElementById("dark-mode-toggle");
  const bodyElement = document.body;
  
  if (localStorage.getItem("dark-mode") === "true") {
    bodyElement.classList.add("dark-mode");
  }

  darkModeButton.addEventListener("click", function () {
    bodyElement.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", bodyElement.classList.contains("dark-mode"));
  });

  // Login/Signup Tabs
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  function switchTab(isLogin) {
      loginForm.classList.toggle("hidden", !isLogin);
      signupForm.classList.toggle("hidden", isLogin);
      loginTab.classList.toggle("active", isLogin);
      signupTab.classList.toggle("active", !isLogin);
  }

  loginTab.addEventListener("click", () => switchTab(true));
  signupTab.addEventListener("click", () => switchTab(false));

  // Dropdown Menu Handling
  const logoContainer = document.querySelector('.logo-container');
  const dropdownMenu = document.getElementById('dropdown-menu');
  let isTouchDevice = 'ontouchstart' in window;

  if (isTouchDevice) {
    logoContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('visible');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('visible');
    });
  }

  // Enhanced Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      const headerHeight = document.querySelector('.navbar').offsetHeight;
      
      if(targetSection) {
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Force layout recalculation
        targetSection.style.scrollMargin = ${headerHeight}px;
        
        // Reset any accidental layout changes
        setTimeout(() => {
          targetSection.style.transform = 'none';
          targetSection.querySelectorAll('img').forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          });
        }, 300);
      }
    });
  });

  document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const commentInput = document.getElementById('comment-input');
    const username = "Anonymous"; // You can implement user auth later
    const comment = commentInput.value.trim();
  
    if(comment) {
      const reviewItem = document.createElement('div');
      reviewItem.className = 'review-item';
      reviewItem.innerHTML = `
        <span class="username">${username}:</span>
        <span class="comment">${comment}</span>
      `;
      
      document.getElementById('reviews-container').prepend(reviewItem);
      commentInput.value = '';
      
      // Store in localStorage
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      reviews.unshift({ username, comment });
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  });
  
  // Load existing reviews on page load
  window.addEventListener('load', () => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const container = document.getElementById('reviews-container');
    
    reviews.forEach(review => {
      const reviewItem = document.createElement('div');
      reviewItem.className = 'review-item';
      reviewItem.innerHTML = `
        <span class="username">${review.username}:</span>
        <span class="comment">${review.comment}</span>
      `;
      container.appendChild(reviewItem);
    });
  });

  // Dropdown functionality
  document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
      if (!button.contains(e.target)) {
        button.classList.remove('active');
      }
    });
  });

  // Close dropdowns on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.classList.remove('active');
      });
    }
  });
});