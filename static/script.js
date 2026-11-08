// ===== DARK / LIGHT THEME TOGGLE =====
document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Initialize theme from localStorage (default: light)
  const savedTheme = localStorage.getItem('site_theme') || 'light';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('site_theme', newTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.title = theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim';
  }
});
