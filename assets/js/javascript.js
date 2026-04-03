const apiKey = 'bcf3bba759d3bdc36eefc72eafbf20c2';

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const cityNameEl = document.getElementById("cityName");
const countryNameEl = document.getElementById("countryName");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const descriptionEl = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

// Main Weather Function
async function checkWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("City not found. Please try again.");
        }

        const data = await response.json();

        // Update UI Text
        cityNameEl.innerText = data.name;
        countryNameEl.innerText = data.sys.country; // This gives the 2-letter country code (e.g., AE)
        tempEl.innerText = Math.round(data.main.temp) + "°C";
        humidityEl.innerText = data.main.humidity + "%";
        windEl.innerText = data.wind.speed + " km/h";
        descriptionEl.innerText = data.weather[0].description;
        
        // Update Icon
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Update Background Theme
        updateTheme(data.weather[0].main);
        
        // Load the 5-day forecast
        getForecast(city);

    } catch (error) {
        alert(error.message);
    }
}

// Forecast Logic
async function getForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    
    const forecastList = document.getElementById("forecastList");
    forecastList.innerHTML = ""; // Clear previous forecast

    // Filter to get data for 12:00 PM each day
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        
        forecastList.innerHTML += `
            <div class="forecast-item">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    });
}

// Theme Switcher
function updateTheme(condition) {
    document.body.className = ""; // Reset classes
    const themes = {
        'Clear': 'bg-clear',
        'Rain': 'bg-rain',
        'Clouds': 'bg-clouds',
        'Snow': 'bg-snow'
    };
    document.body.classList.add(themes[condition] || 'bg-default');
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    if (searchInput.value.trim() !== "") {
        checkWeather(searchInput.value);
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
        checkWeather(searchInput.value);
    }
});