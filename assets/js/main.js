const searchInput = document.getElementById('search')
const trTags = document.querySelectorAll('tbody tr')
const h1 = document.querySelector('h1')

const accents = 'ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňñńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ'
const accents_out = "AAAAAAAAaaaaaaaasOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnnRrSSSsssTtYYyyZZZzzzdGGgg"
const accents_map = new Map()

for (const i in accents) {
  accents_map.set(accents.charCodeAt(i), accents_out.charCodeAt(i))
}

const removeAccents = (str) => {
  const text = new Array(str.length);
  let x, i
  for (i = 0; i < text.length; i++) {
    text[i] = accents_map.get(x = str.charCodeAt(i)) || x;
  }

  return String.fromCharCode.apply(null, text);
}

const getTrTagsToShow = () => {
  const searchInputValues = searchInput.value.toLowerCase().split(' ')
  const matches = []
  let counter = 0
  let trTagsToShow

  trTags.forEach((tr) => {
    const tdTags = [...tr.children]
    tdTags.pop()

    tdTags.forEach((td) => {
      searchInputValues.forEach((searchInputValue) => {
        const tdValue = td.textContent || td.innerText
        if (!removeAccents(tdValue.toLowerCase()).includes(removeAccents(searchInputValue.toLowerCase()))) {
          tr.style.display = 'none'
        } else {
          if (matches[counter]) {
            matches[counter].hits += 1
          } else {
            matches[counter] = {
              hits: 1,
              tr
            }
          }
        }
      })
    })

    counter++
    const maxHits = matches.reduce((acc, match) => acc > match.hits ? acc : match.hits, 0)
    trTagsToShow = matches
      .filter(match => match.hits === maxHits)
      .map(match => match.tr)
  })

  return trTagsToShow
}

const search = () => {
  trTags.forEach(trTag => trTag.style.display = '')
  if (searchInput.value.trim() === '') return
  getTrTagsToShow().forEach(trToShow => trToShow.style.display = '')
}

searchInput.addEventListener(('keyup'), search)
h1.addEventListener('click', () => {
  searchInput.value = ''
  search()
})