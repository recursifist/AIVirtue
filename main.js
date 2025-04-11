document.addEventListener('DOMContentLoaded', () => {
  const namesContainer = document.getElementById('names-container');
  const searchBox = document.getElementById('search');
  const searchContainer = document.getElementById('search-container');
  const toggleSearch = document.getElementById('toggle-search');

  let namesList = [];

  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      namesList = data;
      renderNames(namesList);
    });

  function renderNames(names) {
    namesContainer.innerHTML = names.map(name => `<div class="name-entry" id="${name.toLowerCase().replace(/\s+/g, '-')}">${name}</div>`).join('');
  }

  toggleSearch.addEventListener('click', (e) => {
    e.preventDefault();
    searchContainer.classList.toggle('hidden');
  });

  searchBox.addEventListener('input', () => {
    const searchVal = searchBox.value.toLowerCase();
    if (!searchVal) return;

    const match = namesList.find(name => name.toLowerCase().includes(searchVal));
    if (match) {
      const targetId = match.toLowerCase().replace(/\s+/g, '-');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Pause animation to scroll to target manually
        namesContainer.style.animationPlayState = 'paused';

        const offsetTop = targetElement.offsetTop;
        namesContainer.style.transform = `rotateX(25deg) translateY(-${offsetTop - 100}px)`;
      }
    }
  });
});
