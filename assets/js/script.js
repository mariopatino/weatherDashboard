var inputEl = document.getElementById("searchCity");
var searchBtn = document.getElementById("search-btn");
var historyEl = document.getElementById("lastSearch");
var todayEl = document.getElementById("todayWeather");
var currCityDateEl = document.getElementById("currentDate");
var currIconEl = document.getElementById("currentIcon");
var currTempEl = document.getElementById("currentTemp");
var currWindEl = document.getElementById("currentWind");
var currHumidityEl = document.getElementById("currentHumidity");
var currUviEl = document.getElementById("currentUvi");
var currUviSpan = document.getElementById("uvi");
var frcstEl = document.getElementById("fiveDayForecast");

var APIKey = "871f24efd30b5be94c0e01880027335f";

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    var city = inputEl.value;
    var ApiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(ApiURL)
        .then(function(response1) {
            if (response1.ok) {
            return response1.json();
            } else {
            alert("Please enter a valid city");
            return;
            }
        })

        .then(function(data1) {
            var lat = data1.coord.lat;
            var lon = data1.coord.lon;
            var ApiOneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;

            fetch(ApiOneCall)
            .then(function(response2) {
                return response2.json();
            })
            .then(function(data2) {
                var currCity = data1.name;
                var currDate = moment().format("L");
                var currIconCode = data1.weather[0].icon;
                var currIcon = "https://openweathermap.org/img/wn/" + currIconCode + ".png"
                var currTemp = data2.current.temp;
                var currWind = data2.current.wind_speed;
                var currHumidity = data2.current.humidity;
                var currUVI = data2.current.uvi;

                currCityDateEl.textContent = currCity + " " + currDate;
                currIconEl.setAttribute("src", currIcon);
                currCityDateEl.appendChild(currIconEl);
                currTempEl.textContent = "Temp: " + currTemp + "\u00B0" + "F";
                currWindEl.textContent = "Wind: " + currWind + " MPH";
                currHumidityEl.textContent = "Humidity: " + currHumidity + " \u0025";
                currUviEl.textContent = "UV Index: ";
                currUviSpan.textContent = currUVI;
                currUviEl.appendChild(currUviSpan);

                if (currUVI <= 2.99) {
                    currUviSpan.setAttribute("style", "background-color: green");
                } if (currUVI >= 3 && currUVI <= 5.99) {
                    currUviSpan.setAttribute("style", "background-color: yellow");
                } if (currUVI >= 6) {
                    currUviSpan.setAttribute("style", "background-color: red");
                }

                todayEl.setAttribute("style", "visibility: visible");
                // 5 days forecast for loop
                for (var i= 0; i < 5 ; i++){
                    var newCard = document.createElement("div");
                    newCard.classList = "card";
                    var content = `<div class="card bg-primary text-center">
                              <div class="card-body">
                                <h4 class="card-title">${date}<image src="https://openweathermap.org/img/wn/${data.daily[d].weather[0].icon}.png"></h4>
                                <dl>
                                  <dt>Temp:</dt>
                                  <dd>${temp}°</dd>
                                  <dt>Wind:</dt>
                                  <dd>${wind}MPH</dd>
                                  <dt>Humidity:</dt>
                                  <dd>${humidity}%</dd>
                                </dl>
                              </div>
                              </div>`;
                    newCard.innerHTML = content;
                    cardHolder.appendChild(newCard);
                }
                
                for (var i = 0; i < 5; i++) {
                    var frcstCardEl = document.createElement("div");
                    frcstCardEl.setAttribute("class", "frcst-cards");
                    frcstEl.appendChild(frcstCardEl);

                    var frcstDateEl = document.createElement("h4");
                    frcstDateEl.setAttribute("class", "frcst-dates");
                    frcstDateEl.textContent = moment().add(i + 1, "days").format("L");
                    frcstCardEl.appendChild(frcstDateEl);

                    var frcstWeatherEl = document.createElement("ul");
                    frcstWeatherEl.setAttribute("class", "frcst-weather");
                    frcstCardEl.appendChild(frcstWeatherEl);

                    var frcstIconEl = document.createElement("li");
                    frcstIconEl.setAttribute("class", "frcst-icons");
                    frcstWeatherEl.appendChild(frcstIconEl);

                    var frcstIconCode = data2.daily[i].weather[0].icon;
                    var frcstIcon = "https://openweathermap.org/img/wn/" + frcstIconCode + ".png"
                    var frcstImage = document.createElement("img");
                    frcstImage.setAttribute("src", frcstIcon);
                    frcstIconEl.appendChild(frcstImage);

                    var frcstTempEl = document.createElement("li");
                    frcstTempEl.setAttribute("class", "frcst-temps");
                    var frcstTemp = data2.daily[i].temp.day;
                    frcstTempEl.textContent = "Temp: " + frcstTemp + "\u00B0" + "F";
                    frcstWeatherEl.appendChild(frcstTempEl);

                    var frcstWindEl = document.createElement("li");
                    frcstWindEl.setAttribute("class", "frcst-winds");
                    var frcstWind = data2.daily[i].wind_speed;
                    frcstWindEl.textContent = "Wind: " + frcstWind + " MPH";
                    frcstWeatherEl.appendChild(frcstWindEl);

                    var frcstHumidityEl = document.createElement("li");
                    frcstHumidityEl.setAttribute("class", "frcst-humidities");
                    var frcstHumidity = data2.daily[i].humidity;
                    frcstHumidityEl.textContent = "Humidity: " + frcstHumidity + " \u0025";
                    frcstWeatherEl.appendChild(frcstHumidityEl);

                    if (frcstEl.hasChildNodes()) {
                        frcstEl.replaceChild(frcstCardEl, frcstEl.children[i + 1]);
                    }
                }

                frcstEl.setAttribute("style", "visibility: visible");

                var localStorageContent = localStorage.getItem("cities");

                var cities;
                if (localStorageContent === null) {
                    cities = [];
                } else {
                    cities = JSON.parse(localStorageContent);
                }

                cities.unshift(city);
                var citiesSliced = cities.slice(0,9);

                localStorage.setItem("cities", JSON.stringify(citiesSliced));

                var lastSearch = JSON.parse(localStorage.getItem("cities"));
                
                if (lastSearch !== null) {
                    var newBtn = document.createElement("button");
                    newBtn.setAttribute("class", "history-btns");
                    newBtn.setAttribute("value", lastSearch[0]);
                    newBtn.textContent = lastSearch[0];
                } else {
                    return;
                }

                if (historyEl.hasChildNodes()) {
                    historyEl.insertBefore(newBtn, historyEl.children[0]);
                } else {
                    historyEl.appendChild(newBtn);
                }

                if (lastSearch.length > 8) {
                    historyEl.removeChild(historyEl.children[8]);
                }

            })
        })
});

function renderHistoryBtns() {

    var lastSearch = JSON.parse(localStorage.getItem("cities"));

    if (lastSearch !== null) {
        for (var i = 0; i < 8; i++) {
            var newBtn = document.createElement("button");
            newBtn.setAttribute("class", "history-btns");
            newBtn.setAttribute("value", lastSearch[i]);
            newBtn.textContent = lastSearch[i];
            historyEl.appendChild(newBtn);
            var btnValue = newBtn.getAttribute("value");
            if (btnValue === "undefined") {
                newBtn.setAttribute("style", "display: none");
            }
        } 
    } else {
            return;
    }
}

historyEl.addEventListener("click", function(event) {

    var historyCity = event.target.value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + historyCity + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function(response1) {
            return response1.json();
        })
        .then(function(data1) {
            var lat = data1.coord.lat;
            var lon = data1.coord.lon;
            var oneAPICall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;

            fetch(oneAPICall)
            .then(function(response2) {
                return response2.json();
            })
            .then(function(data2) {
                
                var currCity = data1.name;
                var currDate = moment().format("L");
                var currIconCode = data1.weather[0].icon;
                var currIcon = "https://openweathermap.org/img/wn/" + currIconCode + ".png"
                var currTemp = data2.current.temp;
                var currWind = data2.current.wind_speed;
                var currHumidity = data2.current.humidity;
                var currUVI = data2.current.uvi;

                currCityDateEl.textContent = currCity + " " + currDate;
                currIconEl.setAttribute("src", currIcon);
                currCityDateEl.appendChild(currIconEl);
                currTempEl.textContent = "Temp: " + currTemp + "\u00B0" + "F";
                currWindEl.textContent = "Wind: " + currWind + " MPH";
                currHumidityEl.textContent = "Humidity: " + currHumidity + " \u0025";
                currUviEl.textContent = "UV Index: ";
                currUviSpan.textContent = currUVI;
                currUviEl.appendChild(currUviSpan);

                if (currUVI <= 2.99) {
                    currUviSpan.setAttribute("style", "background-color: green");
                } if (currUVI >= 3 && currUVI <= 5.99) {
                    currUviSpan.setAttribute("style", "background-color: yellow");
                } if (currUVI >= 6) {
                    currUviSpan.setAttribute("style", "background-color: red");
                }

                todayEl.setAttribute("style", "visibility: visible");

                for (var i = 0; i < 5; i++) {
                    var frcstCardEl = document.createElement("div");
                    frcstCardEl.setAttribute("class", "frcst-cards");
                    frcstEl.appendChild(frcstCardEl);

                    var frcstDateEl = document.createElement("h4");
                    frcstDateEl.setAttribute("class", "frcst-dates");
                    frcstDateEl.textContent = moment().add(i + 1, "days").format("L");
                    frcstCardEl.appendChild(frcstDateEl);

                    var frcstWeatherEl = document.createElement("ul");
                    frcstWeatherEl.setAttribute("class", "frcst-weather");
                    frcstCardEl.appendChild(frcstWeatherEl);

                    var frcstIconEl = document.createElement("li");
                    frcstIconEl.setAttribute("class", "frcst-icons");
                    frcstWeatherEl.appendChild(frcstIconEl);

                    var frcstIconCode = data2.daily[i].weather[0].icon;
                    var frcstIcon = "https://openweathermap.org/img/wn/" + frcstIconCode + ".png"
                    var frcstImage = document.createElement("img");
                    frcstImage.setAttribute("src", frcstIcon);
                    frcstIconEl.appendChild(frcstImage);

                    var frcstTempEl = document.createElement("li");
                    frcstTempEl.setAttribute("class", "frcst-temps");
                    var frcstTemp = data2.daily[i].temp.day;
                    frcstTempEl.textContent = "Temp: " + frcstTemp + "\u00B0" + "F";
                    frcstWeatherEl.appendChild(frcstTempEl);

                    var frcstWindEl = document.createElement("li");
                    frcstWindEl.setAttribute("class", "frcst-winds");
                    var frcstWind = data2.daily[i].wind_speed;
                    frcstWindEl.textContent = "Wind: " + frcstWind + " MPH";
                    frcstWeatherEl.appendChild(frcstWindEl);

                    var frcstHumidityEl = document.createElement("li");
                    frcstHumidityEl.setAttribute("class", "frcst-humidities");
                    var frcstHumidity = data2.daily[i].humidity;
                    frcstHumidityEl.textContent = "Humidity: " + frcstHumidity + " \u0025";
                    frcstWeatherEl.appendChild(frcstHumidityEl);

                    if (frcstEl.hasChildNodes()) {
                        frcstEl.replaceChild(frcstCardEl, frcstEl.children[i + 1]);
                    }
                }

                frcstEl.setAttribute("style", "visibility: visible");
            });
        });
});

function init() {
    renderHistoryBtns();
}

init();