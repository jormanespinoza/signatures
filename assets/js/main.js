const searchInput = document.getElementById('search')
const trTags = document.querySelectorAll('tbody tr')
const h1 = document.querySelector('h1')

const search = () => {
  const searchInputValue = searchInput.value.toLowerCase()

  trTags.forEach((tr) => {
    const tdTags = [...tr.children]
    tdTags.pop()
    let tdValues

    tdTags.forEach((td) => {
      tdValues += ' ' + td.textContent || td.innerText
    })

    tr.style.display = tdValues.toLowerCase().includes(searchInputValue) ? '' : 'none'
  })
}

searchInput.addEventListener(('keyup'), search)
h1.addEventListener('click', () => {
  searchInput.value = ''
  search()
})