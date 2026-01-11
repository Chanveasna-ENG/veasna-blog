// js/main.js content
function toggleLanguage() {
    let currentLang = localStorage.getItem('lang') || 'en';
    let newLang = (currentLang === 'en') ? 'jp' : 'en';
    localStorage.setItem('lang', newLang);
    applyLanguage(newLang);
}

function applyLanguage(lang) {
    const enElements = document.querySelectorAll('.lang-en');
    const jpElements = document.querySelectorAll('.lang-jp');

    if (lang === 'jp') {
        enElements.forEach(el => el.classList.add('hidden'));
        jpElements.forEach(el => el.classList.remove('hidden'));
    } else {
        enElements.forEach(el => el.classList.remove('hidden'));
        jpElements.forEach(el => el.classList.add('hidden'));
    }
}

// Automatically runs when any page is opened
document.addEventListener("DOMContentLoaded", function() {
    applyLanguage(localStorage.getItem('lang') || 'en');
});