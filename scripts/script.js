/*SPA aplication all in one*/

//global variables

const firebaseConfig = {
    apiKey: "AIzaSyC1x-geFbGFA8gLAiMYabDMfiHzgxw_v1k",
    authDomain: "flightfinder-fcda8.firebaseapp.com",
    projectId: "flightfinder-fcda8",
    storageBucket: "flightfinder-fcda8.appspot.com",
    messagingSenderId: "396018341516",
    appId: "1:396018341516:web:a29d995743c966cc49cda9"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

let db = firebase.firestore();// db representa mi BBDD //inicia Firestore

let provider = new firebase.auth.GoogleAuthProvider();

let navigationQueuque = []

let globalMap = null

let layerGroup = null

let isSigned = null

//Screens
let flightsSearcherScreen = document.querySelector("section#flightsSearcherScreen")
let landingScreen = document.querySelector("section#landingScreen")
let mapScreen = document.querySelector("section#mapScreen")
let searchByFNumberScreen = document.querySelector("section#searchByFNumberScreen")
let searchByAirportNameScreen = document.querySelector("section#searchByAirportNameScreen")
let flightDetailsScreen = document.querySelector("section#flightDetailsScreen")
let favouritesScreen = document.querySelector("section#favouritesScreen")

//buttons
let authBtn = document.querySelector("#login-screen-btn")
let goSearchBtn = document.querySelector("#search-flights-btn")
let goMapBtn = document.querySelector("#view-map-btn")
let goFavsBtn = document.querySelector("#view-Favs-btn")

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
        img.setAttribute('src', aircraftImage.src)
        img.setAttribute('id', 'aircraftImg')
        flightDetailsScreen.appendChild(img)

    }

    if (isSigned) {
        let saveToFavouritesBtn = document.createElement('button')
        saveToFavouritesBtn.setAttribute('id', 'saveToFavouritesBtn')
        saveToFavouritesBtn.innerHTML = 'Guardar en favoritos'
        saveToFavouritesBtn.addEventListener("click", () => {
            saveFlight(details.identification.number.default)
        })
        flightDetailsScreen.appendChild(saveToFavouritesBtn)
    }

    let detailsBackButton = document.createElement('button')
    detailsBackButton.setAttribute('id', 'detailsBackButton')
    detailsBackButton.innerHTML = 'Go Back'
    detailsBackButton.addEventListener("click", () => { goBackInNavigation(flightDetailsScreen) })

    flightDetailsScreen.appendChild(detailsBackButton)
}

function saveFlight(flighNumber) {
    console.log('guardame esto :', flighNumber);

    let user = firebase.auth().currentUser;

    if (user) {

        let docRef = db.collection("favoritos").doc(user.uid)

        docRef.get()
            .then((doc) => {
                if (doc.data()) {
                    //si existen datos se añaden
                    let flights = doc.data().flights
                    console.log('payload existente :', flights);
                    flights.push(flighNumber)
                    console.log('nuevo payload : ', flights);
                    docRef.set({ flights })
                        .then(() => {
                            console.log("Document successfully written!");
                        })
                        .catch((error) => console.error("Error adding document: ", error));
                } else {
                    //sino se crean
                    docRef.set(
                        { flights: [flighNumber] }
                    )
                        .then(() => {
                            console.log("Document successfully written!");
                        })
                        .catch((error) => console.error("Error adding document: ", error));

                }
            })
            .catch((error) => console.error("Error reading document: ", error));

    } else {
        // El usuario no está autenticado
        console.log('El usuario no está autenticado.');
    }


}

function loadFavs() {

    favouritesScreen.innerHTML = null

    let user = firebase.auth().currentUser;

    if (user) {

        let docRef = db.collection("favoritos").doc(user.uid)

        docRef.get()
            .then((doc) => {
                if (doc.data()) {
                    let favs = doc.data()

                    let flightsFavsltitle = document.createElement('h1')
                    flightsFavsltitle.setAttribute('id', 'flightsFavsltitle')
                    flightsFavsltitle.appendChild(document.createTextNode(`Tus Favoritos`))

                    favouritesScreen.appendChild(flightsFavsltitle)

                    let favsList = document.createElement('ul')
                    favsList.setAttribute('id', 'favsList')

                    for (const fav of favs.flights) {
                        favsList.appendChild(document.createElement('li').appendChild(document.createTextNode(fav)))
                        favsList.appendChild(document.createElement('br'))
                    }

                    favouritesScreen.appendChild(favsList)

                    let favsBackButton = document.createElement('button')
                    favsBackButton.setAttribute('id', 'favsBackButton')
                    favsBackButton.innerHTML = 'Go Back'
                    favsBackButton.addEventListener("click", () => { goBackInNavigation(favouritesScreen) })

                    favouritesScreen.appendChild(favsBackButton)
                }
            })
            .catch((error) => console.error("Error reading document: ", error));

    } else {
        // El usuario no está autenticado
        console.log('El usuario no está autenticado.');
    }

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

function showNewLocationOnMap(latitude, longitude) {

    let location = { x: latitude, y: longitude }

    globalMap.setView([latitude, longitude], 12)

    layerGroup.clearLayers()

    L.marker([latitude, longitude]).addTo(layerGroup);

    addTransport(location)

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
            viewBylocationBTN.setAttribute('id', 'viewBylocationBTN')
            viewBylocationBTN.innerHTML = 'Find in Map'
            viewBylocationBTN.addEventListener('click', () => {
                showNewLocationOnMap(result.detail.lat, result.detail.lon)
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

function showFavsScreen() {

    navigationQueuque.push(landingScreen)

    loadFavs()

    swapScreens(landingScreen, favouritesScreen)
}

function showSinginPopUP() {

    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            // User is signed in with Google.
            //var user = result.user;
            //console.log('Successfully signed in with Google:', user);

            authBtn.removeEventListener('click', showSinginPopUP)

            authBtn.addEventListener('click', logout)

        })
        .catch(function (error) {
            // Handle errors here, e.g., user canceled the sign-in popup or there was an error.
            console.error('Google sign-in error:', error);
        });



}

function logout() {
    firebase.auth().signOut()
        .then(function () {
            // Sign-out successful.
            console.log('User signed out');
        })
        .catch(function (error) {
            // An error happened.
            console.error('Logout error:', error);
        });
}

// ------ events and Start -------

firebase.auth().onAuthStateChanged(function (user) {

    isSigned = user ? true : false;

    if (user) {
        // User is signed in.
        console.log('User is signed in');

        authBtn.innerHTML = 'LogOut'

        authBtn.removeEventListener('click', showSinginPopUP)

        authBtn.addEventListener('click', logout)

        if (goFavsBtn.hidden)
            goFavsBtn.toggleAttribute('hidden')

    } else {
        // User is signed out.
        console.log('User is signed out');

        authBtn.innerHTML = 'LogIn/SignUp'

        authBtn.addEventListener('click', showSinginPopUP)

        authBtn.removeEventListener('click', logout)

        if (!goFavsBtn.hidden)
            goFavsBtn.toggleAttribute('hidden')
    }

    console.log('is signed ', isSigned);
});

window.addEventListener("load", () => {

    try {
        console.log(window.env);
    } catch (error) {
        console.log('error caching env variables');
    }
    

    goSearchBtn.addEventListener("click", showSearchFlightsScreen)

    goMapBtn.addEventListener("click", showMapWithCurrentLocation)

    authBtn.addEventListener("click", showSinginPopUP)

    goFavsBtn.addEventListener('click', showFavsScreen)

    initScreens()

})