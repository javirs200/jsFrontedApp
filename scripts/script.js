/*SPA aplication all in one*/

//global variables
let navigationQueuque = []

let globalMap = null

let layerGroup = null

//Screens
let flightsSearcherScreen = document.querySelector("section#flights-searcher-screen")
let landingScreen = document.querySelector("section#landing-screen")
let mapScreen = document.querySelector("section#map-screen")

//iconos para el mapa
let planeIcon = L.icon({
    iconUrl: './assets/plane.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point fr5om which the popup should open relative to the iconAnchor
});

//flights api
const baseURL = 'https://flight-radar1.p.rapidapi.com/flights/list-in-boundary?';
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

    let searcherForm = document.createElement('from')
    searcherForm.setAttribute('id', 'searcherForm')

    let searcherfieldset = document.createElement("fieldset")
    searcherfieldset.setAttribute("id", "searcherfieldset")

    let searcherlegend = document.createElement("legend");
    searcherlegend.setAttribute("id", "searcherlegend")
    searcherlegend.innerHTML = "<h3>searcher</h3>";

    let searcherinput = document.createElement('input')
    searcherinput.setAttribute("id", "searcherinput")
    searcherinput.setAttribute('type', 'text')

    searcherForm.appendChild(searcherfieldset)
    searcherfieldset.appendChild(searcherlegend)
    searcherfieldset.appendChild(searcherinput)

    let searcherBackButton = document.createElement('button')
    searcherBackButton.setAttribute('id', 'SearcherButton')
    searcherBackButton.innerHTML = 'Go Back'
    searcherBackButton.addEventListener("click", () => { goBackInNavigation(flightsSearcherScreen) })

    flightsSearcherScreen.appendChild(searcherBackButton)
}

//navigation methods

function goBackInNavigation(actualScreen) {
    let previousScreen = navigationQueuque.pop()
    console.log(actualScreen, '->', previousScreen)

    //oculto
    actualScreen.toggleAttribute("hidden")
    //muestro
    previousScreen.toggleAttribute("hidden")
}

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

async function addTransport(location) {

    let planes = await callApi(location)

    console.log(planes.aircraft);

    let viones = planes.aircraft

    for (const plane of viones) {
        L.marker([plane[2], plane[3]], { icon: planeIcon }).bindPopup(plane[1]).addTo(layerGroup);
    }

}

async function callApi(location) {
    return await fetch(getApiUrl(location), options)
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.error("Error calling to api: ", error));
}

function getApiUrl(location) {
    return baseURL + `bl_lat=${location.x - 1}&bl_lng=${location.y - 1}&tr_lat=${location.x + 1}&tr_lng=${location.y + 1}&limit=300`
}

function showMapWithCurrentLocation() {

    navigationQueuque.push(landingScreen)

    //calculo previo al cambio de pantallas
    getLocation()

    //oculto landing
    landingScreen.toggleAttribute("hidden")
    //muestro mapa
    mapScreen.toggleAttribute("hidden")

}

function showSearchFlightsScreen() {

    navigationQueuque.push(landingScreen)

    //oculto landing
    landingScreen.toggleAttribute("hidden")
    //muestro buscador
    flightsSearcherScreen.toggleAttribute("hidden")

}

// ------ load event -------

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