/*SPA aplication all in one*/

//global variables

let planeIcon = L.icon({
    iconUrl: './assets/plane.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0,0] // point fr5om which the popup should open relative to the iconAnchor
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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        console.log("Geolocation is not supported by this browser.");;
    }
}


async function showPosition(position) {

    let location = { x: position.coords.latitude, y: position.coords.longitude }

    let map = L.map('map').setView([location.x, location.y], 12);

    await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const marker = L.marker([location.x, location.y]).addTo(map);

    let layerGroup = L.layerGroup().addTo(map);

    console.log(location);

    addTransport(layerGroup,location)
}

async function addTransport(layerGroup,location) {

    let planes = await callApi(location)

    console.log(planes.aircraft);

    let viones = planes.aircraft

    layerGroup.clearLayers();

    for (const plane of viones) {
        L.marker([plane[2], plane[3]], { icon: planeIcon }).bindPopup(plane[1]).addTo(layerGroup);
    }

}

//api call 
async function callApi(location) {
    return await fetch(getApiUrl(location),options)
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.error("Error calling to api: ", error));
}

function getApiUrl(location) {
    return baseURL + `bl_lat=${location.x-1}&bl_lng=${location.y-1}&tr_lat=${location.x+1}&tr_lng=${location.y+1}&limit=300`
}

function showMapWithCurrentLocation() {

    //calculo previo al cambio de pantallas
    getLocation()

    let mapBackButton = document.createElement('button')
    mapBackButton.setAttribute('id','mapBackButton')
    mapBackButton.innerHTML = 'Go Back'
    mapBackButton.addEventListener("click", ()=>{console.log("not implemented yet")})

    document.querySelector("section#map-screen").appendChild(mapBackButton)

    //oculto landing
    document.querySelector("section#landing-screen").toggleAttribute("hidden")
    //muestro quiz
    document.querySelector("section#map-screen").toggleAttribute("hidden")

}

function showSearchFlightsScreen() {

    //oculto landing
    document.querySelector("section#landing-screen").toggleAttribute("hidden")
    //muestro quiz
    document.querySelector("section#flights-searcher-screen").toggleAttribute("hidden")

}

// ------ events -------

window.addEventListener("load", () => {

    //go to search-flights
    document.querySelector("#search-flights-btn")
        .addEventListener("click", showSearchFlightsScreen)

    //go to search-flights
    document.querySelector("#view-map-btn")
        .addEventListener("click", showMapWithCurrentLocation)

    //go to search-flights
    document.querySelector("#login-screen-btn")
        .addEventListener("click", ()=>{console.log("not implemented yet")})

})