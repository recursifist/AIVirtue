import scene from "./scene.min.js"

function onReady(fun) {
  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fun, 1)
  else document.addEventListener("DOMContentLoaded", fun)
}
const x = (x) => x.split('').reverse().join('').split('').map(z =>
  String.fromCharCode(z.charCodeAt(0) - 3)).join('')

onReady(async () => {
  await scene.create('scene-container', 'data.json', 'scene.glb')

  const contentContainer = document.getElementById("content-container")
  const homeContainer = document.getElementById("home-container")
  const sceneContainer = document.getElementById("scene-container")
  const criteriaContainer = document.getElementById("criteria-container")
  const criteriaForm = criteriaContainer.querySelector("form")
  const criteriaCloseButton = criteriaContainer.getElementsByClassName("close-button")[0]
  const submitButton = criteriaForm.querySelector("button")
  const descriptionContainer = document.getElementById("description-container")
  const descriptionHtml = descriptionContainer.innerHTML

  const goToWall = document.getElementById("goToWall")
  const goToCriteria = document.getElementById("goToCriteria")
  const toggleHome = document.getElementById("home-toggle")
  const toggleCriteria = document.getElementById("criteria-toggle")
  const toggleSearch = document.getElementById("search-toggle")
  const searchContainer = document.getElementById("search-container")
  const searchBox = document.getElementById("searchbox")
  const searchCloseButton = searchContainer.getElementsByClassName("close-button")[0]

  const hideAllViews = () => {
    homeContainer.classList.add("hidden")
    sceneContainer.classList.add("hidden")
    criteriaContainer.classList.add("hidden")
    searchContainer.classList.add("hidden")
    contentContainer.classList.add("hidden")
  }

  const showView = (view) => {
    hideAllViews()
    view.classList.remove("hidden")
    if (view.parentElement.id === 'content-container') {
      contentContainer.classList.remove("hidden")
    }
  }

  goToWall.addEventListener('click', () => {
    showView(sceneContainer)
    window.dispatchEvent(new Event('resize'))
  })
  goToCriteria.addEventListener('click', () => {
    showView(criteriaContainer)
  })

  toggleHome.addEventListener('click', () => {
    showView(homeContainer)
  })

  toggleCriteria.addEventListener('click', () => {
    showView(criteriaContainer)
    criteriaContainer.focus()
  })
  const closeCriteria = () => {
    showView(sceneContainer)
    window.dispatchEvent(new Event('resize'))
  }
  criteriaCloseButton.addEventListener('click', closeCriteria)
  criteriaContainer.addEventListener('keydown', (e) => { if (e.key === "Escape") closeCriteria() })
  submitButton?.addEventListener('click', (e) => {
    e.preventDefault()
    const q = x("prf1{pjCurqrKiRoodZhxwulYLD")
    criteriaForm.setAttribute("action", "mailto:" + q)
    criteriaForm.submit()
    showView(sceneContainer)
  })

  toggleSearch.addEventListener('click', () => {
    showView(sceneContainer)
    searchContainer.classList.remove('hidden')
    searchBox.focus()
  })

  const clearSearch = () => {
    if (searchBox.value?.length > 0) {
      searchBox.value = ""
      scene.search("")
    }
    showView(sceneContainer)
  }
  searchCloseButton.addEventListener('click', () => clearSearch())
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Escape") clearSearch() })
  searchBox.addEventListener("input", function () { scene.search(this.value) })
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Enter") { scene.search(searchBox.value) } })

  sceneContainer.addEventListener('click', () => {
    setTimeout(() => {
      const item = scene.getSelected()
      if (item) {
        descriptionContainer.innerHTML = `
        <span class="close-button">close</span>
        <strong class="tagline">Why ${item.name} meets the criteria:</strong>
        <p>
          ${item.text}
          <br>
          <a target="_blank" href="${item.link}">See reference</a>
        </p>
        `
      } else {
        descriptionContainer.innerHTML = descriptionHtml
      }
    }, 100)
  })

  const searchFromUrl = () => setTimeout(() => {
    const query = document.location.search
    if (query?.length > 1) {
      const q = query.slice(3)
      searchBox.value = q
      toggle.click()
      scene.search(q)
    }
  }, 1000)
  searchFromUrl()
})