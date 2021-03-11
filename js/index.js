// Languages
const lang = [
  {
    name: "France",
    code: "fr"
  },
  {
    name: "afrikaans",
    code: "af"
  },
  {
    name: "arabic",
    code: "ar"
  },
  {
    name: "German",
    code: "de"
  },
  {
    name: "Greek",
    code: "el"
  },
  {
    name: "English",
    code: "en"
  },
  {
    name: "Galician",
    code: "gl"
  },
  {
    name: "Hebrew",
    code: "he"
  },
  {
    name: "Hindi",
    code: "hi"
  },
  {
    name: "Indonesian",
    code: "id"
  },
  {
    name: "Italian",
    code: "it"
  },
  {
    name: "Japanese",
    code: "ja"
  },
  {
    name: "Korean",
    code: "kr"
  },
  {
    name: "Norwegian",
    code: "no"
  },
  {
    name: "Dutch",
    code: "nl"
  },
  {
    name: "Polish",
    code: "pl"
  },
  {
    name: "Portuguese",
    code: "pt"
  },
  {
    name: "Portuguese Brasil",
    code: "pt_br"
  },
  {
    name: "Romanian",
    code: "ro"
  },
  {
    name: "Russian",
    code: "ru"
  },
  {
    name: "Swedish",
    code: "sv"
  },
  {
    name: "Spanish",
    code: "es"
  },
  {
    name: "Serbian",
    code: "sr"
  },
  {
    name: "Thai",
    code: "th"
  },
  {
    name: "Turkish",
    code: "tr"
  },
  {
    name: "Ukrainian",
    code: "ua"
  },
  {
    name: "Vietnamese",
    code: "vi"
  },
  {
    name: "Chinese",
    code: "zh_cn"
  },
]
const cards = JSON.parse(localStorage.getItem("cards"))
// Use empty cards array if localstorage API doesn't work
// const cards = []
const addCityInput = document.getElementById('add-city')
const form = document.getElementById('form')
const detailButton = document.getElementById('detailMode')
const detailContainer = document.getElementById("detail-container")
const cardList = document.getElementById('info-weather-container')
const languageDropdown = document.getElementById('langdropdown')

// Loops the dropdown
languageDropdown.innerHTML = lang.map((l, index) => 
  `<option value="${l.code}" id="option${index}">${l.name}</option>`
)

// 
languageDropdown.addEventListener('click', (e) => {
  cards.forEach(card => {
    currentWeatherByCityName(card.cityName, window.appId, e.target.value)
  })
})

renderAllCards(document.getElementById('info-weather-container'), document.getElementById('detail-container'))

reRenderDetail(document.getElementById('detail-container'))
// Listen the delete event to delete a card
cardList.addEventListener('click', removeCard)

addCityInput.addEventListener('input', ()=> {
  addCityInput.classList.remove("error-city-input")
})

detailButton.addEventListener('click', ()=> {
  const mapContainer = document.getElementById("map-container")

  if (mapContainer.hidden === false) {
    mapContainer.hidden = true
    detailContainer.hidden = false
    detailButton.innerText = "Map Mode"
  } else {
    mapContainer.hidden = false
    detailContainer.hidden = true
    detailButton.innerText = "Detail Mode"
  }
})
// })

// API Request by city name 
function currentWeatherByCityName(cityName, appId, lang) {

  Promise.all([
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appId}&units=metric&lang=${lang}`),
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${appId}&units=metric&lang=${lang}`)
  ])
  .then(async ([res1, res2]) => {

    // Response 1 
    const currentWeather = await res1.json()
    // Response 2
    const forecastWeather = await res2.json()

    handleError(currentWeather, forecastWeather)

    // Handle if there is 2 times the same value
    cards.forEach((card , index) => {
    if(card.id === currentWeather.id) {
        cards.splice(index, 1)
    }
    })

    addCard(currentWeather, forecastWeather)

    // Execute fonction to render all cards
    renderAllCards(document.getElementById('info-weather-container'), document.getElementById('detail-container'))

    // Clear value after enter
    addCityInput.value = ''
    // Add listener on my card
    cardList.addEventListener('click', removeCard)
  }).catch(e => {
        console.log(e)
  })
}

function removeCard(e) {
    // Handle bug with if statement
    if(e.target.parentElement.childNodes[5].innerText === undefined) {

    } else {
      e.target.parentElement.parentElement.remove()
      cards.forEach((card , index) => {
          // If html element equal array value then array item is deleted
          if (card.cityName === e.target.parentElement.childNodes[5].innerText) {
              // Local Storage Here
              cards.splice(index, 1)
              localStorage.setItem('cards',JSON.stringify(cards));
          }
      })
    }
    reRenderDetail(document.getElementById('detail-container'))
}


form.addEventListener('submit', (e)=> {
    e.preventDefault()
    const formValue = e.target[0].value
    currentWeatherByCityName(formValue, window.appId, languageDropdown.value)
})


// GOOGLE MAP PART 
let map;

function initMap() {
    // Lat Lng by default
    
    const myLatlng = { lat: 51.509865, lng: -0.118092};
    map = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 8,
        styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#181818"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1b1b1b"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#2c2c2c"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8a8a8a"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#373737"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#3c3c3c"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#4e4e4e"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3d3d3d"
                }
              ]
            }
          ]
    });
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get the weather of a city!",
        position: myLatlng,
    });

    infoWindow.open(map);
    // Configure the click listener
    map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow
    infoWindow.close()
        // API request to search a city by geographic coordinate 
    function findCitiesByLatAndLon(lat, lon, appId, lang) {
      Promise.all([
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=&appid=${appId}&units=metric&lang=${lang}`),
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=&appid=${appId}&units=metric&lang=${lang}`)
      ])
      .then(async ([res1, res2]) => {

        // Response 1 
        const currentWeather = await res1.json()
        // Response 2
        const forecastWeather = await res2.json()
        
        handleError(currentWeather, forecastWeather)
        
        // Handle if there is 2 times the same value
        cards.forEach((card , index) => {
          if(card.id === currentWeather.id) {
              cards.splice(index, 1)
          }
        })

        addCard(currentWeather, forecastWeather)

        cards.forEach((card => {
          if(card.country == undefined) {
            card.country = ""
          }
        }))
        // Handle hour in each country later
       
        // Execute fonction to render all cards
        renderAllCards( document.getElementById('info-weather-container'), document.getElementById('detail-container'))

        const cardList = document.getElementById('info-weather-container')
        // Clear value after enter
        addCityInput.value = ''
        // Add listener on my card
        cardList.addEventListener('click', removeCard)
    }).catch(e => {
        console.log(e)
    })
    }
    findCitiesByLatAndLon(mapsMouseEvent.latLng.toJSON().lat, mapsMouseEvent.latLng.toJSON().lng, window.appId, languageDropdown.value)
  });
}

// Render cards function
function renderAllCards(infoWeatherContainer, detailContainer) {
  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  infoWeatherContainer.innerHTML = cards.map(carditem => 
    `
    <div class="card"">
        <div class="card-body">
            <h5 class="card-title">Current Weather</h5>
            <h6 class="card-subtitle mb-2 text-muted">${carditem.country}</h6>
            <h6 class="card-subtitle mb-2 text-muted">${carditem.cityName}</h6>
            <p class="card-text">Temperature (now): ${Math.round(carditem.temperature)} °C
            <img src="../images/tools-and-utensils.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Description: ${carditem.description.toUpperCase()} <img id="wicon" src="http://openweathermap.org/img/w/${carditem.icon}.png" alt="Weather icon"></p>
            <p class="card-text">Date: ${date}
            <img src="../images/calendar.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Time by timezone: ${Number(time.split(":")[0]) + carditem.timezone - 1}:${time.split(":")[1]}:${time.split(":")[2]}
            <img src="../images/clock.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Sunrise by timezone: ${Number(carditem.sunrise.split(":")[0]) + carditem.timezone - 1}:${carditem.sunrise.split(":")[1]}:${carditem.sunrise.split(":")[2]}
            <img src="../images/sunrise.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Sunset by timezone: ${Number(carditem.sunset.split(":")[0]) + carditem.timezone - 1}:${carditem.sunset.split(":")[1]}:${carditem.sunset.split(":")[2]}
            <img src="../images/sea.svg" alt="" width="30" height="24">
            </p>
            <a href="#" class="btn btn-danger">Delete</a>
        </div>
    </div>
    `
).join('')
  
  detailContainer.innerHTML =  cards.map((carditem, index) =>
    `
    <div class="card"">
        <div class="card-body">
            <h5 class="card-title">Current Weather</h5>
            <h6 class="card-subtitle mb-2 text-muted">${carditem.country}</h6>
            <h6 class="card-subtitle mb-2 text-muted">${carditem.cityName}</h6>
            <p class="card-text">Temperature (now): ${Math.round(carditem.temperature)} °C
            <img src="../images/tools-and-utensils.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Description: ${carditem.description.toUpperCase()} <img id="wicon" src="http://openweathermap.org/img/w/${carditem.icon}.png" alt="Weather icon"></p>
            <p class="card-text">Date: ${date}
            <img src="../images/calendar.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Time by timezone: ${Number(time.split(":")[0]) + carditem.timezone - 1}:${time.split(":")[1]}:${time.split(":")[2]}
            <img src="../images/clock.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Sunrise by timezone: ${Number(carditem.sunrise.split(":")[0]) + carditem.timezone - 1}:${carditem.sunrise.split(":")[1]}:${carditem.sunrise.split(":")[2]}
            <img src="../images/sunrise.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Sunset by timezone: ${Number(carditem.sunset.split(":")[0]) + carditem.timezone - 1}:${carditem.sunset.split(":")[1]}:${carditem.sunset.split(":")[2]}
            <img src="../images/sea.svg" alt="" width="30" height="24">
            </p>
            <h6 class="card-subtitle mb-2 text-muted">Forecast</h6>
            <canvas id="myChart${index}" width="400" height="400"></canvas>
        </div>
    </div>
    `
).join('')
    displayChartLoop()
}

// Display Chart
function displayChartLoop() {
  let chartData = []
    
  for(let iChart = 0; iChart < cards.length; iChart++) {
    const element = cards[iChart]
    for(let i = 0; i < element.forecastList.length; i += 2) {
      const forecastEl = element.forecastList[i]
      chartData.push({
        date: forecastEl.dt_txt,
        temp: forecastEl.main.temp
      })
    }
    // Create a myChart id which depends of the length of my cards array
    var ctx = document.getElementById(`myChart${iChart}`).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
          labels: chartData.map(chart => chart.date),
          datasets: [{
              label: 'Temperature forecast °C',
              data: chartData.map(chart => chart.temp),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
    });
    chartData = []
  }
}


function reRenderDetail(detailCard) {

  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  detailCard.innerHTML = cards.map((carditem, index) => 
    `
    <div class="card"">
        <div class="card-body">
            <h5 class="card-title">Current Weather</h5>
            <h6 class="card-subtitle mb-2 text-muted">${carditem.country}</h6>
            <h6 class="card-subtitle mb-2 text-muted">${carditem.cityName}</h6>
            <p class="card-text">Temperature (now): ${Math.round(carditem.temperature)} °C
            <img src="../images/tools-and-utensils.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Description: ${carditem.description.toUpperCase()} <img id="wicon" src="http://openweathermap.org/img/w/${carditem.icon}.png" alt="Weather icon"></p>
            <p class="card-text">Date: ${date}
            <img src="../images/calendar.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Time by Timezone: ${Number(time.split(":")[0]) + carditem.timezone - 1}:${time.split(":")[1]}:${time.split(":")[2]}
            <img src="../images/clock.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Sunrise by timezone: ${Number(carditem.sunrise.split(":")[0]) + carditem.timezone - 1}:${carditem.sunrise.split(":")[1]}:${carditem.sunrise.split(":")[2]}
            <img src="../images/sunrise.svg" alt="" width="30" height="24">
            </p>
            <p class="card-text">Sunset by timezone: ${Number(carditem.sunset.split(":")[0]) + carditem.timezone - 1}:${carditem.sunset.split(":")[1]}:${carditem.sunset.split(":")[2]}
            <img src="../images/sea.svg" alt="" width="30" height="24">
            </p>
            <h6 class="card-subtitle mb-2 text-muted">Forecast</h6>
            <canvas id="myChart${index}" width="400" height="400"></canvas>
        </div>
    </div>
    `

).join('')
  displayChartLoop()
}


// HandleError function
function handleError(currentWeather, forecastWeather) {
  if(currentWeather.cod == 400) {
    addCityInput.classList.add("error-city-input")
    Snackbar.show({
      text: currentWeather.message, 
      backgroundColor: "red",
  });
  }

  if(forecastWeather.cod == 400) {
    addCityInput.classList.add("error-city-input")
    Snackbar.show({
      text: forecastWeather.message, 
      backgroundColor: "red",
  });
  }

  if(currentWeather.cod == 404) {
    addCityInput.classList.add("error-city-input")
    Snackbar.show({
      text: currentWeather.message, 
      backgroundColor: "red",
  });
  }
  // if(languageDropdown.value )
}

// Add Card function
function addCard(currentWeather, forecastWeather) {
   // Calcul sunrise and sunset timestamp and push in the object
   const sunriseHour = new Date(currentWeather.sys.sunrise * 1000).getHours()
   const sunsetHour = new Date(currentWeather.sys.sunset * 1000).getHours()

   const sunriseMinute = "0" + new Date(currentWeather.sys.sunrise * 1000).getMinutes()
   const sunsetMinute = "0" + new Date(currentWeather.sys.sunset * 1000).getMinutes()


   const sunriseSeconds = "0" + new Date(currentWeather.sys.sunrise * 1000).getSeconds()
   const sunsetSeconds = "0" + new Date(currentWeather.sys.sunset * 1000).getSeconds()

   const sunriseTime = sunriseHour + ':' + sunriseMinute.substr(-2) + ':' + sunriseSeconds.substr(-2);
   const sunsetTime = sunsetHour + ':' + sunsetMinute.substr(-2) + ':' + sunsetSeconds.substr(-2);
  
  // Push a city
  cards.push({
    id: currentWeather.id,
    cityName: currentWeather.name,
    country: currentWeather.sys.country,
    temperature: currentWeather.main.temp,
    description: currentWeather.weather[0].description,
    icon: currentWeather.weather[0].icon,
    timezone: currentWeather.timezone / 60 / 60,
    sunrise: sunriseTime,
    sunset: sunsetTime,
    forecastList: forecastWeather.list,
  })
  localStorage.setItem("cards", JSON.stringify(cards))
}