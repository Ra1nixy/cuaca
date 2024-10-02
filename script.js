const apiKey = '030980a4d96a42a6b9a34baa81f44a6c'; // Replace with your OpenWeather API key
let firstSearch = true; // Flag to track the first search

document.getElementById('search-btn').addEventListener('click', function() {
    const location = document.getElementById('location-input').value;
    if(location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayWeather(data) {
    if (data.cod === 200) {
        const weatherWidget = document.getElementById('weather-widget');
        const weatherDisplay = document.getElementById('weather-display');

        // Check if it's the first search
        if (firstSearch) {
            // Expand the widget and show the weather info without animations
            weatherWidget.classList.add('expand');
            
            // Populate weather information directly (no zoom animation)
            document.getElementById('city-name').textContent = data.name;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('weather-description').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('wind-speed').textContent = `${data.wind.speed} km/h`;

            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.getElementById('weather-icon').src = iconUrl;

            // Set the firstSearch flag to false after the initial search
            firstSearch = false;

        } else {
            // Add the 'sliding-out' class to trigger the zoom-out animation
            weatherWidget.classList.remove('sliding-in', 'expand');
            weatherWidget.classList.add('sliding-out');

            // Wait for the zoom-out animation to complete (500ms)
            setTimeout(() => {
                // Hide the display after the zoom-out animation
                weatherDisplay.classList.add('hide');

                // Update the weather information
                document.getElementById('city-name').textContent = data.name;
                document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
                document.getElementById('weather-description').textContent = data.weather[0].description;
                document.getElementById('humidity').textContent = `${data.main.humidity}%`;
                document.getElementById('wind-speed').textContent = `${data.wind.speed} km/h`;

                const iconCode = data.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
                document.getElementById('weather-icon').src = iconUrl;

                // Remove the 'sliding-out' class and prepare to zoom-in the new info
                weatherWidget.classList.remove('sliding-out');
                weatherWidget.classList.add('expand', 'sliding-in');

                // After expanding, show the display and trigger zoom-in animation
                setTimeout(() => {
                    weatherDisplay.classList.remove('hide');
                }, 10); // Small delay to ensure smooth transition

            }, 500); // Match this timeout with the CSS zoom-out duration (0.5s)
        }
    } else {
        alert('Location not found!');
    }
}
