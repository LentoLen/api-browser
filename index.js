const url = "https://api.publicapis.org/"

const getResponse = async (url) => {
    let categories
    const res = await fetch(url)

    categories = await res.json()
    return categories
}

const categoriesDropdown = async ()  => {
    const data = await getResponse(url+"categories")
    categories = data.categories
    const dropdown = document.getElementById("category-select")

    dropdown.innerHTML = "<option>Category</option><option>All</option><option>Random</option>"

    categories.forEach(element => {
        dropdown.innerHTML += (`<option>${element}</option>`)
    });
}

const toggleChip = (id) => {
    document.getElementById(id).classList.toggle("secondary")
    changeCategory()
}

const createCategoryCard = (category) => {
    const cardString = ` <div role="button" onclick="setCategory('${category}')" class="card outline"><h3>${category}</h3></div>`
    document.getElementById("card-section").innerHTML += cardString
}

const setCategory = (category) => {
    const select = document.getElementById("category-select")
    const options = Array.from(select.options)
    const option = options.find(item => item.text == category)
    option.selected = true
    changeCategory()
}

const createCard = (heading, category, desc, auth, https, cors, link) => {
    let noAuth = ""
    let uhttps = ""
    let corss = ""

    if (!auth) {
        noAuth = '<div role="button" class="badge">no-auth</div> '
    }
    if (https) {
        uhttps = '<div role="button" class="badge">https</div> ' 
    }
    if (cors) {
        corss = '<div role="button" class="badge">cors</div>' 
    }
    const cardString = `<div role="button" onclick="window.open('${link}', '_blank')" class="card outline"><div card-body><hgroup><h3>${heading}</h3><h6>${category}</h6></hgroup><div class="desc">${desc}</div></div><div class="card-footer"><hr><div>${noAuth}${uhttps}${corss}</div></div>`
    
    document.getElementById("card-section").innerHTML += cardString
}

const filterCards = () => {
    let input = document.getElementById("search").value.toUpperCase()
    let cards = document.getElementsByClassName("card")
    let categorySelect = document.getElementById("category-select")
    let category = categorySelect.options[categorySelect.selectedIndex].text

    if (category == "All") {
        document.getElementById("card-section").innerHTML = ""
        showCards(category, input)
    }

    Array.from(cards).forEach(element => {
        txtValue = element.getElementsByTagName("h3")[0].innerHTML
        if (txtValue.toUpperCase().indexOf(input) > -1) {
            element.style.display = "flex"
        } else {
            element.style.display = "none"
        }
    });
}

const shuffle_array = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

const showCards = async (category, title="") => {
    let params = "entries?"
    let search = ""
    let noauth = !document.getElementById("no-auth").classList.contains("secondary")
    let https = !document.getElementById("https").classList.contains("secondary")
    let cors = !document.getElementById("cors").classList.contains("secondary")

    if (noauth) {
        params += "&auth=null"
    }
    if (https) {
        params += "&https=true"
    }
    if (cors) {
        params += "&cors=yes"
    }
    if (category != "All" && category != "Random") {
        params += `&category=${category.toLowerCase().split(" ")[0]}`
    }
    if (title) {
        search = "&title="+title
    }

    const data = await getResponse(url+params+search)
    let cards = data.entries

    if (cards == null) {
        cards = []
    }
    if (cards.length < 10 && title) {
        const d = await getResponse(url+params+"&description="+title)
        descSearch = d.entries
        if (descSearch != null) {
            if (cards.length > 0) {
                cards = cards.concat(descSearch)
            } else {
                cards = descSearch
            }
        } 
    }

    if (cards.length > 150) {
        cards.length = 150
    }

    if (category == "Random") {
        cards = shuffle_array(cards)
    }

    cards.forEach(el => {
        console.log("now")
        createCard(el.API, el.Category, el.Description, el.Auth, el.HTTPS, el.Cors, el.Link)
    });

    // filter
}

const showCategories = async () => {
    const data = await getResponse(url+"categories")
    let categories = data.categories

    categories.forEach(element => {
        console.log("now")
        createCategoryCard(element)
    });
}

const changeCategory = () => {
    let categorySelect = document.getElementById("category-select")
    let category = categorySelect.options[categorySelect.selectedIndex].text

    document.getElementById("search").value = ""
    document.getElementById("card-section").innerHTML = ""

    if (category == "Category") {
        showCategories()
    } else {
        showCards(category)
    }
    
}

categoriesDropdown()
showCategories()