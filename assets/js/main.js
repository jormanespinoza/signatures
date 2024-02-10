const BASE_URL = 'https://sarapura-signatures.netlify.app'
const RESOURCE = 'member'
const SIGNATURE_FILENAME = 'signature.html'

const accents =
  'ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňñńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ'
const accentsOut =
  'AAAAAAAAaaaaaaaasOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnnRrSSSsssTtYYyyZZZzzzdGGgg'
const accentsMap = new Map()
for (const i in accents) {
  accentsMap.set(accents.charCodeAt(i), accentsOut.charCodeAt(i))
}

const buildMembersGrid = () => {
  const searchInput = document.getElementById('search')
  const trTags = document.querySelectorAll('tbody tr')
  const h1 = document.querySelector('h1')

  /**
   * Removes accents from a string.
   *
   * @param {string} str The string to remove accents from.
   * @returns {string} The string with accents removed.
   */
  const removeAccents = (str) => {
    return Array.from(str, (char) => {
      const code = char.charCodeAt(0)
      return accentsMap.get(code) || char
    }).join('')
  }

  /**
   * Gets the table rows that match the search term.
   *
   * @returns {HTMLTableRowElement[]} The matching table rows.
   */
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
          if (
            !removeAccents(tdValue.toLowerCase()).includes(
              removeAccents(searchInputValue.toLowerCase())
            )
          ) {
            tr.style.display = 'none'
          } else if (matches[counter]) {
            matches[counter].hits += 1
          } else {
            matches[counter] = {
              hits: 1,
              tr
            }
          }
        })
      })

      counter++
      const maxHits = matches.reduce(
        (acc, match) => (acc > match.hits ? acc : match.hits),
        0
      )
      trTagsToShow = matches
        .filter((match) => match.hits === maxHits)
        .map((match) => match.tr)
    })

    return trTagsToShow
  }

  const search = () => {
    // Hide all table rows
    trTags.forEach((trTag) => (trTag.style.display = ''))
    if (searchInput.value.trim() === '') {
      return
    }

    // Show the matching table rows
    getTrTagsToShow().forEach((trToShow) => (trToShow.style.display = ''))
  }

  // Event listeners
  searchInput.addEventListener('keyup', search)
  h1.addEventListener('click', () => {
    searchInput.value = ''
    search()
  })
}

// Function to dynamically append JSON data to table tbody
const appendMembersToTable = (membersData) => {
  const table = document.getElementsByTagName('table')[0]
  const tbody = table.getElementsByTagName('tbody')[0]

  membersData.forEach((item) => {
    const { first_name, last_name, position, slug } = item

    const row = tbody.insertRow()
    const cell1 = row.insertCell(0)
    const cell2 = row.insertCell(1)
    const cell3 = row.insertCell(2)
    const cell4 = row.insertCell(3)

    cell1.textContent = first_name
    cell2.textContent = last_name
    cell3.textContent = position

    const link = document.createElement('a')
    link.href = `${BASE_URL}/${RESOURCE}/${slug}/${SIGNATURE_FILENAME}`
    link.textContent = 'Firma'
    link.target = '_blank'

    cell4.appendChild(link)
  })
}

// Fetch members JSON data from external file
fetch('./assets/js/members.json')
  .then((response) => response.json())
  .then((membersData) => {
    // Append JSON data to table tbody
    appendMembersToTable(membersData)
  })
  .then(() => buildMembersGrid())
  .catch((error) => console.error('Error fetching JSON:', error))
