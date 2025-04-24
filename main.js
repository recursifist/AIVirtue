import scene from "./scene.js"

function onReady(fun) {
  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fun, 1)
  else  document.addEventListener("DOMContentLoaded", fun)
}

onReady(async () => {
  await scene.create('scene-container', 'data.json', 'scene.glb')

  let searchState = false
  let aboutState = false
  const toggleSearch = document.getElementById("search-toggle")
  const toggleAbout = document.getElementById("about-toggle")
  const searchContainer = document.getElementById("search-container")
  const searchBox = document.getElementById("searchbox")
  const searchCloseButton = searchContainer.getElementsByClassName("close-button")[0]
  const aboutBox = document.getElementById("aboutBox")
  const aboutCloseButton = aboutBox.getElementsByClassName("close-button")[0]

  toggleSearch.addEventListener('click', () => {
    searchState = !searchState
    searchContainer.classList.toggle("hidden", !searchState)
    searchContainer.focus()
  })
  const clearSearch = () => {
    searchBox.value = ""
    scene.search("")
    toggleSearch.click()
  }
  searchCloseButton.addEventListener('click', () => clearSearch())
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Escape") clearSearch()})
  searchBox.addEventListener("input", function() { scene.search(this.value) })
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Enter") { scene.search(searchBox.value) } })

  toggleAbout.addEventListener('click', () => {
    aboutState = !aboutState
    aboutBox.classList.toggle("hidden", !aboutState)
    aboutBox.focus()
  })
  aboutCloseButton.addEventListener('click', () => toggleAbout.click())
  aboutBox.addEventListener('keydown', (e) => { if (e.key === "Escape") toggleAbout.click()})

  const searchFromUrl = () => setTimeout(() => { 
    const query = document.location.search
    if(query?.length > 1) {
      const q = query.slice(3)
      searchBox.value = q
      toggle.click()
      scene.search(q)
    }
  }, 1000)
  searchFromUrl()
})