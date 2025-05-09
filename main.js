import scene from "./scene.min.js"

function onReady(fun) {
  if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fun, 1)
  else document.addEventListener("DOMContentLoaded", fun)
}
const x = (x) => x.split('').reverse().join('').split('').map(z =>
  String.fromCharCode(z.charCodeAt(0) - 3)).join('')

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
  const sceneContainer = document.getElementById("scene-container")
  const descriptionContainer = document.getElementById("description")
  const descriptionHtml = descriptionContainer.innerHTML
  const submitButton = document.querySelector("#aboutBox form input[type='button']")

  submitButton?.addEventListener('click', (e) => {
    e.preventDefault()
    const aboutForm = document.querySelector("#aboutBox form")
    const q = x("prf1{pjCurqrKiRoodZhxwulYLD")
    aboutForm.setAttribute("action", "mailto:"+q)
    aboutForm.submit()
  })

  toggleSearch.addEventListener('click', () => {
    searchState = !searchState
    searchContainer.classList.toggle("hidden", !searchState)
    searchBox.focus()
  })
  const clearSearch = () => {
    searchBox.value = ""
    scene.search("")
    toggleSearch.click()
  }
  searchCloseButton.addEventListener('click', () => clearSearch())
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Escape") clearSearch() })
  searchBox.addEventListener("input", function () { scene.search(this.value) })
  searchBox.addEventListener('keydown', (e) => { if (e.key === "Enter") { scene.search(searchBox.value) } })

  toggleAbout.addEventListener('click', () => {
    aboutState = !aboutState
    aboutBox.classList.toggle("hidden", !aboutState)
    aboutBox.focus()
  })
  aboutCloseButton.addEventListener('click', () => toggleAbout.click())
  aboutBox.addEventListener('keydown', (e) => { if (e.key === "Escape") toggleAbout.click() })

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