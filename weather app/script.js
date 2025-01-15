document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errorMessage = document.getElementById("error-message");
  const loadingMessage = document.getElementById("loading");
  const unitToggleBtn = document.getElementById("unit-toggle");
  const clearInputBtn = document.getElementById("clear-input");

  const API_KEY = "5f56d525d1619d0a2cd2eac4ce55588e"; // Your API key

  let currentUnit = "metric"; // Default unit is Celsius

  // Event listener for Get Weather button
  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;
    
    showLoading(true);

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError(error);
    } finally {
      showLoading(false);
    }
  });

  // Fetch weather data from the API
  async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found. Please try again.");
    }
    const data = await response.json();
    return data;
  }

  // Display weather data on the page
  function displayWeatherData(data) {
    const { name, main, weather } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = `Temperature: ${main.temp}°`;
    descriptionDisplay.textContent = `Weather: ${weather[0].description}`;
    document.getElementById("weather-icon").src = iconUrl; // Display weather icon

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  // Show error message
  function showError(error) {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = error.message;
  }

  // Show or hide loading spinner
  function showLoading(isLoading) {
    if (isLoading) {
      loadingMessage.classList.remove("hidden");
    } else {
      loadingMessage.classList.add("hidden");
    }
  }

  // Toggle between Celsius and Fahrenheit
  unitToggleBtn.addEventListener("click", () => {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    const unitLabel = currentUnit === "metric" ? "Celsius" : "Fahrenheit";
    unitToggleBtn.textContent = `Switch to ${unitLabel}`;
  });

  // Clear the city input field
  clearInputBtn.addEventListener("click", () => {
    cityInput.value = "";
    weatherInfo.classList.add("hidden");
    errorMessage.classList.add("hidden");
  });
});
