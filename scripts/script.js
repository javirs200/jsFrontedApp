//variables globales
const mapboxApiToken = "access_token=pk.eyJ1IjoicnNtYXgiLCJhIjoiY2xudDB2NGNxMTdlZTJqbXoza2JyZnl0bSJ9.K0F_DzA9r6WvsgF4d6EEQw"

let mapboxApiEndpoint = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/"



async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else { 
    console.log("Geolocation is not supported by this browser.");;
  }
}

async function showPosition(position) {
  console.log(position["coords"]);
  let mapboxApiParams = "-122.4241,37.78,10,0,0/400x400?"
  let url = mapboxApiEndpoint+mapboxApiParams+mapboxApiToken
  console.log(url);
  let response = await fetch(url);
  let container = document.getElementById("mapa")
  let img = document.createElement("img")
  img.src = response
  container.appendChild(img)
}

async function createMapboxApiParams(){
  
}

async function getMap() {
  
}

window.onload = () => {
    let boton = document.getElementById("accion");
  
    if (boton != null) {
  
      boton.onclick = () => {
        getLocation()
      }
    }
  }
  
  