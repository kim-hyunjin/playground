const weather = document.querySelector(".js-weather");
const weatherState = weather.querySelector(".js-state");
const weatherTemp = weather.querySelector(".js-temp");
const weatherPlace = weather.querySelector(".js-place");

const API_KEY = "44691c4927cf5659e3b6fd5d4cca0c32";
const COORD = "coordinates";

function paintState(state) {
  switch (state) {
    case "Clear":
      weatherState.innerHTML = `<i class="far fa-sun"></i>`;
      break;
    case "Rain":
      weatherState.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
      break;
    case "Clouds":
      weatherState.innerHTML = `<i class="fas fa-cloud"></i>`;
      break;
    case "Snow":
      weatherState.innerHTML = `<i class="far fa-snowflake"></i>`;
      break;
    case "Drizzle":
      weatherState.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
      break;
    case "Thunderstrom":
      weatherState.innerHTML = `<i class="fas fa-cloud-showers-heavy"></i>`;
      break;
    default:
      weatherState.innerHTML = `<i class="fas fa-smog"></i>`;
      break;
  }
}

function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const temperature = json.main.temp;
      weatherTemp.innerHTML = temperature.toFixed(1) + "º";
      const state = json.weather[0].main;
      paintState(state);
      const place = json.name;
      weatherPlace.innerHTML = place;
    });
}

function saveCoord(coordObj) {
  localStorage.setItem(COORD, JSON.stringify(coordObj));
}

function handlePositionSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordObj = {
    latitude: latitude,
    longitude: longitude,
  };
  saveCoord(coordObj);
  getWeather(latitude, longitude);
}

function handlePositionError() {
  console.log("Can't access geo location");
}

function askCoord() {
  navigator.geolocation.getCurrentPosition(
    handlePositionSuccess,
    handlePositionError
  );
}

function loadCoord() {
  const loadedCoord = localStorage.getItem(COORD);
  if (loadedCoord === null) {
    askCoord();
  } else {
    const parsedCoord = JSON.parse(loadedCoord);
    getWeather(parsedCoord.latitude, parsedCoord.longitude);
  }
}

function init() {
  loadCoord();
}

init();
