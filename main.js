import scene from "./scene.min.js"

function onReady(fun) {
  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fun, 1)
  else document.addEventListener("DOMContentLoaded", fun)
}

onReady(async () => {
  await scene.create('scene-container', 'data.json', 'scene.glb')

  const contentContainer = document.getElementById("content-container")
  const homeContainer = document.getElementById("home-container")
  const sceneContainer = document.getElementById("scene-container")
  const criteriaContainer = document.getElementById("criteria-container")
  const criteriaCloseButton = criteriaContainer.getElementsByClassName("close-button")[0]
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
    window.dispatchEvent(new Event('resize'))
  }

  goToWall.addEventListener('click', () => {
    showView(sceneContainer)
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
  }
  criteriaCloseButton.addEventListener('click', closeCriteria)
  criteriaContainer.addEventListener('keydown', (e) => { if (e.key === "Escape") closeCriteria() })

  toggleSearch.addEventListener('click', () => {
    showView(sceneContainer)
    sceneContainer.click()
    searchContainer.classList.remove('hidden')
    searchBox.focus()
  })
  const clearSearch = () => {
    if (searchBox.value?.length > 0) {
      searchBox.value = ""
      scene.search("")
      document.location.hash = ''
    }
    showView(sceneContainer)
  }
  const doSearch = (q) => {
    scene.search(q)
    document.location.hash = q
  } 
  searchCloseButton.addEventListener('click', () => clearSearch())
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Escape") clearSearch() })
  searchBox.addEventListener("input", function () { doSearch(this.value) })
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Enter") { doSearch(searchBox.value) } })

  sceneContainer.addEventListener('click', (e) => {
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
    e.preventDefault()
  })

  const searchFromUrl = () => setTimeout(() => {
    const query = document.location.hash
    if (query?.length > 1) {
      showView(sceneContainer)
      const q = query.slice(1)
      toggleSearch.click()
      searchBox.value = q
      scene.search(q)
    }
  }, 1000)
  searchFromUrl()

  setTimeout(() => {
    document.body.classList.remove('invisible')
    document.body.classList.add('fadeIn')
  }, 500)
})