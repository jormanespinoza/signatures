const searchInput = document.getElementById('search')
const trTags = document.querySelectorAll('tbody tr')
const h1 = document.querySelector('h1')

const search = () => {
  const searchInputValue = searchInput.value.toLowerCase()

  trTags.forEach((tr) => {
    const tdTags = [...tr.children]
    tdTags.pop()

    let match = false

    tdTags.forEach((td) => {
      const tdValue = td.textContent || td.innerText
      if (tdValue.toLowerCase().includes(searchInputValue)) {
        match = true
      }
    })

    tr.style.display = match ? '' : 'none'
  })
}

searchInput.addEventListener(('keyup'), search)
h1.addEventListener('click', () => {
  searchInput.value = ''
  search()
})