
// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
mobileMenuBtn.addEventListener('click', () => {
  const isHidden = mobileNav.style.display === 'none';
  if (isHidden) {
    mobileNav.style.display = 'block';
    mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
  } else {
    mobileNav.style.display = 'none';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  }
});
const mobileLinks = mobileNav.querySelectorAll('a');
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.style.display = 'none';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Scroll animations via IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach((section) => {
  observer.observe(section);
});
