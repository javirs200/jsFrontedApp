/*SPA aplication all in one*/

//global variables
let navigationQueuque = []

let globalMap = null

let layerGroup = null

//Screens
let flightsSearcherScreen = document.querySelector("section#flightsSearcherScreen")
let landingScreen = document.querySelector("section#landingScreen")
let mapScreen = document.querySelector("section#mapScreen")
let searchByFNumberScreen = document.querySelector("section#searchByFNumberScreen")
let searchByAirportNameScreen = document.querySelector("section#searchByAirportNameScreen")
let flightDetailsScreen = document.querySelector("section#flightDetailsScreen")

//map icons
let planeIcon = L.icon({
    iconUrl: './assets/plane.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point fr5om which the popup should open relative to the iconAnchor
});

//flights api
const flightMoreInfoBaseURL = 'https://flight-radar1.p.rapidapi.com/flights/get-more-info?';
const flightSearchBaseURL = 'https://flight-radar1.p.rapidapi.com/flights/search?';
const flightsBaseURL = 'https://flight-radar1.p.rapidapi.com/flights/list-in-boundary?';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'a80124b517mshda7b86570e21e92p17fc41jsnf7d2c2431c56',
        'X-RapidAPI-Host': 'flight-radar1.p.rapidapi.com'
    }
};


//---- funciones --------

//inicializadores

function initScreens() {
    initMapScren()
    initSearcherScreen()
}

async function initMapScren() {

    globalMap = L.map('map');

    layerGroup = L.layerGroup().addTo(globalMap);

    await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(globalMap);

    let mapBackButton = document.createElement('button')
    mapBackButton.setAttribute('id', 'mapBackButton')
    mapBackButton.innerHTML = 'Go Back'
    mapBackButton.addEventListener("click", () => { goBackInNavigation(mapScreen) })

    mapScreen.appendChild(mapBackButton)
}

function initSearcherScreen() {

    let gotoSearchByFliightNumberBtn = document.createElement('button')
    gotoSearchByFliightNumberBtn.setAttribute('id', 'SearcherButton')
    gotoSearchByFliightNumberBtn.innerHTML = 'Buscar Por Numero de Vuelo'
    gotoSearchByFliightNumberBtn.addEventListener("click", () => {
        fillSearchByNumberScreen()
        navigationQueuque.push(flightsSearcherScreen)
        swapScreens(flightsSearcherScreen, searchByFNumberScreen)
    })

    let gotoSearchByAirportNameBtn = document.createElement('button')
    gotoSearchByAirportNameBtn.setAttribute('id', 'gotoSearchByAirportNameBtn')
    gotoSearchByAirportNameBtn.innerHTML = 'Buscar por Aeropuerto Nombre o ICAO/IATA'
    gotoSearchByAirportNameBtn.addEventListener("click", () => {
        console.log("pulsado");
        fillSearchByAirportNameScreen()
        navigationQueuque.push(flightsSearcherScreen)
        swapScreens(flightsSearcherScreen, searchByAirportNameScreen)
    })

    let searcherBackButton = document.createElement('button')
    searcherBackButton.setAttribute('id', 'searcherBackButton')
    searcherBackButton.innerHTML = 'Go Back'
    searcherBackButton.addEventListener("click", () => { goBackInNavigation(flightsSearcherScreen) })

    flightsSearcherScreen.appendChild(gotoSearchByFliightNumberBtn)
    flightsSearcherScreen.appendChild(gotoSearchByAirportNameBtn)
    flightsSearcherScreen.appendChild(searcherBackButton)
}

function fillSearchByAirportNameScreen() {
    searchByAirportNameScreen.innerHTML = null

    let searcherByAirportNamerForm = document.createElement('form')
    searcherByAirportNamerForm.setAttribute('id', 'searcherByAirportNameForm')

    let searcherByAirportNamefieldset = document.createElement("fieldset")
    searcherByAirportNamefieldset.setAttribute("id", "searcherByAirportNamefieldset")

    let searcherByAirportNamelegend = document.createElement("legend");
    searcherByAirportNamelegend.setAttribute("id", "searcherByAirportNamelegend")
    searcherByAirportNamelegend.innerHTML = "<h2>Buscador por Aeropuerto Nombre o ICAO/IATA</h2>";

    let searcherByAirportNameinput = document.createElement('input')
    searcherByAirportNameinput.setAttribute("id", "searcherByAirportNameinput")
    searcherByAirportNameinput.setAttribute('type', 'text')
    searcherByAirportNameinput.setAttribute('required', 'true')

    let searchByAirportNameSubmitbtn = document.createElement('input')
    searchByAirportNameSubmitbtn.setAttribute('id', 'searchByAirportNameSubmitbtn')
    searchByAirportNameSubmitbtn.setAttribute('type', 'submit')
    searchByAirportNameSubmitbtn.appendChild(document.createTextNode('buscar'))

    searcherByAirportNamerForm.appendChild(searcherByAirportNamefieldset)
    searcherByAirportNamefieldset.appendChild(searcherByAirportNamelegend)
    searcherByAirportNamefieldset.appendChild(searcherByAirportNameinput)
    searcherByAirportNamerForm.appendChild(searchByAirportNameSubmitbtn)

    searcherByAirportNamerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let formAirportNameInput = event.target.querySelector('#searcherByAirportNameinput').value

        //console.log(formAirportNameInput);

        findAirport(formAirportNameInput)

        navigationQueuque.push(searchByAirportNameScreen)
        swapScreens(searchByAirportNameScreen, flightDetailsScreen)

    })

    searchByAirportNameScreen.appendChild(searcherByAirportNamerForm)

    let formByAirportNameBackButton = document.createElement('button')
    formByAirportNameBackButton.setAttribute('id', 'formBackButton')
    formByAirportNameBackButton.innerHTML = 'Go Back'
    formByAirportNameBackButton.addEventListener("click", () => { goBackInNavigation(searchByAirportNameScreen) })

    searchByAirportNameScreen.appendChild(formByAirportNameBackButton)
}

function fillSearchByNumberScreen() {
    searchByFNumberScreen.innerHTML = null

    let searcherByNumberForm = document.createElement('form')
    searcherByNumberForm.setAttribute('id', 'searcherByFNumberForm')

    let searcherByFNumbrerFieldset = document.createElement("fieldset")
    searcherByFNumbrerFieldset.setAttribute("id", "searcherByFNumbrerfieldset")

    let searcherByFNumbrerLegend = document.createElement("legend");
    searcherByFNumbrerLegend.setAttribute("id", "searcherByFNumbrerlegend")
    searcherByFNumbrerLegend.innerHTML = "<h2>Buscador por numero de Vuelo</h2>";

    let searcherByFNumbrerInput = document.createElement('input')
    searcherByFNumbrerInput.setAttribute("id", "searcherByFNumbrerinput")
    searcherByFNumbrerInput.setAttribute('type', 'text')
    searcherByFNumbrerInput.setAttribute('required', 'true')

    let searchByFNumbrerSubmitbtn = document.createElement('input')
    searchByFNumbrerSubmitbtn.setAttribute('id', 'searchByFNumbrerSubmitbtn')
    searchByFNumbrerSubmitbtn.setAttribute('type', 'submit')
    searchByFNumbrerSubmitbtn.appendChild(document.createTextNode('buscar'))

    searcherByNumberForm.appendChild(searcherByFNumbrerFieldset)
    searcherByFNumbrerFieldset.appendChild(searcherByFNumbrerLegend)
    searcherByFNumbrerFieldset.appendChild(searcherByFNumbrerInput)
    searcherByNumberForm.appendChild(searchByFNumbrerSubmitbtn)

    searcherByNumberForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let formFlightNumberInput = event.target.querySelector('#searcherByFNumbrerinput').value
        //console.log(formFlightNumberInput);

        findFlight(formFlightNumberInput)

        navigationQueuque.push(searchByFNumberScreen)
        swapScreens(searchByFNumberScreen, flightDetailsScreen)

    })

    searchByFNumberScreen.appendChild(searcherByNumberForm)

    let formByFNumbrerBackButton = document.createElement('button')
    formByFNumbrerBackButton.setAttribute('id', 'formByFNumbrerBackButton')
    formByFNumbrerBackButton.innerHTML = 'Go Back'
    formByFNumbrerBackButton.addEventListener("click", () => { goBackInNavigation(searchByFNumberScreen) })

    searchByFNumberScreen.appendChild(formByFNumbrerBackButton)
}

function fillFlightDatailsScreen(details, aircraftImage) {

    flightDetailsScreen.innerHTML = null

    let flightDetailtitle = document.createElement('h1')
    flightDetailtitle.setAttribute('id', flightDetailtitle)
    flightDetailtitle.appendChild(document.createTextNode(`detalles de Vuelo : ${details.identification.number.default}`))

    flightDetailsScreen.appendChild(flightDetailtitle)

    let detailList = document.createElement('ul')
    detailList.setAttribute('id', 'flighDetailList')

    detailList.appendChild(document.createElement('li').appendChild(document.createTextNode(`Estado : ${details.status.text}`)))
    detailList.appendChild(document.createElement('br'))

    detailList.appendChild(document.createElement('li').appendChild(document.createTextNode(`Aerolinea : ${details.airline.name}`)))
    detailList.appendChild(document.createElement('br'))

    detailList.appendChild(document.createElement('li').appendChild(document.createTextNode(`Pais de origen : ${details.airport.origin.position.country.name}`)))
    detailList.appendChild(document.createElement('br'))

    detailList.appendChild(document.createElement('li').appendChild(document.createTextNode(`Aeropuerto de origen : ${details.airport.origin.name}`)))
    detailList.appendChild(document.createElement('br'))

    detailList.appendChild(document.createElement('li').appendChild(document.createTextNode(`Pais de destino : ${details.airport.destination.position.country.name}`)))
    detailList.appendChild(document.createElement('br'))

    detailList.appendChild(document.createElement('li').appendChild(document.createTextNode(`Aeropuerto de destno : ${details.airport.destination.name}`)))
    detailList.appendChild(document.createElement('br'))

    flightDetailsScreen.appendChild(detailList)

    if (aircraftImage != null) {

        let img = document.createElement('img')
        img.style.width = '100%'
        img.setAttribute('src', aircraftImage.src)
        flightDetailsScreen.appendChild(img)

    }

    let detailsBackButton = document.createElement('button')
    detailsBackButton.setAttribute('id', 'detailsBackButton')
    detailsBackButton.innerHTML = 'Go Back'
    detailsBackButton.addEventListener("click", () => { goBackInNavigation(flightDetailsScreen) })

    flightDetailsScreen.appendChild(detailsBackButton)
}

//navigation methods

function swapScreens(toHideScreen, toShowScreen) {
    //oculto
    toHideScreen.toggleAttribute("hidden")
    //muestro
    toShowScreen.toggleAttribute("hidden")
}

function goBackInNavigation(actualScreen) {
    let previousScreen = navigationQueuque.pop()
    swapScreens(actualScreen, previousScreen)
}

//location methods

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function showPosition(position) {

    let location = { x: position.coords.latitude, y: position.coords.longitude }

    globalMap.setView([location.x, location.y], 12)

    layerGroup.clearLayers()

    L.marker([location.x, location.y]).addTo(layerGroup);

    addTransport(location)
}

//planes methods

async function addTransport(location) {

    let planes = await callApi(location)

    let viones = planes.aircraft

    for (const plane of viones) {

        let h2 = document.createElement('h2')

        //14th atribute correspond to flight number
        if (plane[14] != '') {
            h2.appendChild(document.createTextNode(plane[14]))
            h2.addEventListener("click", () => {
                findFlight(plane[14])
                navigationQueuque.push(mapScreen)
                swapScreens(mapScreen, flightDetailsScreen)
            })
        } else {
            //withouth flight number , show plates or id
            h2.style.color = 'lightgray'
            h2.appendChild(document.createTextNode(plane[10]))
        }

        let planeMarker = L.marker([plane[2], plane[3]], { icon: planeIcon })
        planeMarker.bindPopup(h2)
        planeMarker.addTo(layerGroup);
    }

}

function showNewLocationOnMap(latitude,longitude){

    let position = {'coords':{'latitude':latitude,'longitude':longitude}}

    showPosition(position)

}

async function findAirport(AirportName) {

    //console.log(AirportName);

    let data = await apiSearchbyAirportName(AirportName)

    flightDetailsScreen.innerHTML = null

    if (data != null) {
        
        //console.log(data.results);

        let airportList = document.createElement('ul')

        for (const result of data.results) {
            //console.log(result);
            let airportListElement = document.createElement('li')
            airportListElement.appendChild(document.createElement('h2')
                .appendChild(document.createTextNode(result.label)))
            airportListElement.appendChild(document.createElement('br'))
            airportListElement.appendChild(document.createElement('p')
                .appendChild(document.createTextNode("latitud : " + result.detail.lat)))
            airportListElement.appendChild(document.createElement('br'))
            airportListElement.appendChild(document.createElement('p')
                .appendChild(document.createTextNode("longitud : " + result.detail.lon)))

            let viewBylocationBTN = document.createElement('button')
            viewBylocationBTN.setAttribute('id','viewBylocationBTN')
            viewBylocationBTN.innerHTML = 'Find in Map'
            viewBylocationBTN.addEventListener('click',()=>{
                showNewLocationOnMap(result.detail.lat,result.detail.lon)
                navigationQueuque.push(flightDetailsScreen)
                swapScreens(flightDetailsScreen, mapScreen)
            })
            airportListElement.appendChild(viewBylocationBTN)
            
            airportList.appendChild(airportListElement)
        }

        flightDetailsScreen.appendChild(airportList)

    } else {
        flightDetailsScreen.appendChild(
            document.createElement('h1').appendChild(
                document.createTextNode(`no existen vuelos con el identificador ${flighNumber}`)))
    }

    let detailsBackButton = document.createElement('button')
    detailsBackButton.setAttribute('id', 'detailsBackButton')
    detailsBackButton.innerHTML = 'Go Back'
    detailsBackButton.addEventListener("click", () => { goBackInNavigation(flightDetailsScreen) })
    flightDetailsScreen.appendChild(detailsBackButton)

}

async function findFlight(flighNumber) {

    let data = await apiMoreInfoByFNumber(flighNumber)
    console.log('vuelos encontrados ->')

    if (data.result.response.data != null) {
        let flightData = data.result.response.data
        let flight = flightData.filter((el) => el.status.live == true || el.aircraft.registration != null)
        let aircraftImages = data.result.response.aircraftImages
        let image = aircraftImages.filter((el) => el.registration == flight[0].aircraft.registration)
        fillFlightDatailsScreen(flight[0], image[0].images.medium[0])
    } else {
        flightDetailsScreen.innerHTML = null
        flightDetailsScreen.appendChild(
            document.createElement('h1').appendChild(
                document.createTextNode(`no existen vuelos con el identificador ${flighNumber}`)))
        let detailsBackButton = document.createElement('button')
        detailsBackButton.setAttribute('id', 'detailsBackButton')
        detailsBackButton.innerHTML = 'Go Back'
        detailsBackButton.addEventListener("click", () => { goBackInNavigation(flightDetailsScreen) })
        flightDetailsScreen.appendChild(detailsBackButton)
    }
    console.log("------------");
}

//api calls

async function callApi(location) {
    return await fetch(getApiUrl(location), options)
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.error("Error calling to api: ", error));
}

async function apiSearchbyAirportName(AirportName) {
    let querry = `query=${AirportName}&limit=25`
    let url = flightSearchBaseURL + querry
    return await fetch(url, options)
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.error("Error calling to api: ", error));
}

async function apiMoreInfoByFNumber(flightNumber) {
    let querry = `query=${flightNumber}&fetchBy=flight&page=1&limit=100`
    let url = flightMoreInfoBaseURL + querry
    return await fetch(url, options)
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.error("Error calling to api: ", error));
}

function getApiUrl(location) {
    return flightsBaseURL + `bl_lat=${location.x - 1}&bl_lng=${location.y - 1}&tr_lat=${location.x + 1}&tr_lng=${location.y + 1}&limit=300`
}

//listeners

function showMapWithCurrentLocation() {

    //calculo previo al cambio de pantallas
    getLocation()

    navigationQueuque.push(landingScreen)

    swapScreens(landingScreen, mapScreen)

}

function showSearchFlightsScreen() {

    navigationQueuque.push(landingScreen)

    swapScreens(landingScreen, flightsSearcherScreen)

}

// ------ events and Start -------

window.addEventListener("load", () => {

    //go to search-flights
    document.querySelector("#search-flights-btn")
        .addEventListener("click", showSearchFlightsScreen)

    //go to search-flights
    document.querySelector("#view-map-btn")
        .addEventListener("click", showMapWithCurrentLocation)

    //go to search-flights
    document.querySelector("#login-screen-btn")
        .addEventListener("click", () => { console.log("not implemented yet") })

    initScreens()

})