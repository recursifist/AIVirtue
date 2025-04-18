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
  const closeButton = document.getElementsByClassName("close-button")[0]
  const searchBox = document.getElementById("searchbox")
  const aboutBox = document.getElementById("aboutBox")

  toggleSearch.addEventListener('click', () => {
    searchState = !searchState
    searchBox.classList.toggle("hidden", !searchState)
    searchBox.focus()
  })

  toggleAbout.addEventListener('click', () => {
    aboutState = !aboutState
    aboutBox.classList.toggle("hidden", !aboutState)
    aboutBox.focus()
  })
  closeButton.addEventListener('click', () => toggleAbout.click())


  searchBox.addEventListener('keydown', (e) => { 
    if (e.key === "Escape") {
      toggleState = false
      searchBox.value = ""
      scene.search("")
      searchBox.classList.add("hidden")
    }
  })
  searchBox.addEventListener("input", function() { scene.search(this.value) })
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Enter") { scene.search(searchBox.value) } })
  setTimeout(() => { 
    const query = document.location.search
    if(query?.length > 1) {
      const q = query.slice(3)
      searchBox.value = q
      toggle.click()
      scene.search(q)
    }
  }, 1000)
})