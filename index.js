const API_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search?name=';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast?current_weather=true';

// Weather icons mapping
const weatherIcons = {
    0: "https://openweathermap.org/img/wn/01d.png",  // Clear sky
    1: "https://openweathermap.org/img/wn/02d.png",  // Mostly clear
    2: "https://openweathermap.org/img/wn/03d.png",  // Partly cloudy
    3: "https://openweathermap.org/img/wn/04d.png",  // Overcast
    45: "https://openweathermap.org/img/wn/50d.png", // Fog
    61: "https://openweathermap.org/img/wn/10d.png", // Light rain
    80: "https://openweathermap.org/img/wn/09d.png", // Light rain showers
    95: "https://openweathermap.org/img/wn/11d.png", // Thunderstorm
};

// Function to fetch weather for a given city
async function getWeather(city) {
    try {
        // Step 1: Convert City Name to Coordinates (Geocoding)
        const geoResponse = await fetch(`${API_BASE_URL}${city}&count=1&format=json`);
        const geoData = await geoResponse.json();

        console.log(geoData); // Debugging: Check API response

        if (!geoData.results || geoData.results.length === 0) {
            document.getElementById('weather').innerText = "City not found. Try again.";
            document.getElementById('weather-icon').src = "";
            return;
        }

        const { latitude, longitude } = geoData.results[0];

        // Step 2: Fetch Weather Data for the Coordinates
        const weatherResponse = await fetch(`${WEATHER_BASE_URL}&latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        console.log(weatherData); // Debugging: Check API response

        const temperature = weatherData.current_weather.temperature;
        const weatherCode = weatherData.current_weather.weathercode;
        const weatherIcon = weatherIcons[weatherCode] || "https://openweathermap.org/img/wn/50d.png";

        // Get wind speed if available
        let windSpeedText = "";
        if (weatherData.current_weather.windspeed !== undefined) {
            windSpeedText = `💨 Wind Speed: ${weatherData.current_weather.windspeed} km/h\n`;
        }

        // Update the HTML with the weather data
        document.getElementById('weather').innerText = `🌡️ ${city}: ${temperature}°C\n${windSpeedText}`;
        document.getElementById('weather-icon').src = weatherIcon;

    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById('weather').innerText = "Error fetching data. Try again.";
        document.getElementById('weather-icon').src = "";
    }
}

// Event Listener for the Search Button
document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        await getWeather(city);
    } else {
        document.getElementById('weather').innerText = "Please enter a city name.";
        document.getElementById('weather-icon').src = "";
    }
});
