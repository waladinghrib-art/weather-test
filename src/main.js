import './style.css';
import { getWeather } from './weather.js';
import { loadCarousel } from './photos.js';

const DEFAULT_CITY = 'Tunis';

const form = document.querySelector('#search');
const input = document.querySelector('#city');
const card = document.querySelector('#card');
const message = document.querySelector('#message');

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'message error' : 'message';
  message.hidden = !text;
}

function render(weather) {
  if (weather.temperature === null || !weather.weather) {
    card.hidden = true;
    showMessage('Almost there! The backend works, but TODO 2 is not done yet: open src/weather.js.', true);
    return;
  }

  card.querySelector('.city').textContent = weather.city;
  card.querySelector('.country').textContent = weather.country;
  card.querySelector('.emoji').textContent = weather.weather.emoji;
  card.querySelector('.temperature').textContent = `${Math.round(weather.temperature)}°C`;
  card.querySelector('.condition').textContent = weather.weather.text;
  card.querySelector('.humidity').textContent = weather.humidity ?? '–';
  card.querySelector('.wind').textContent = weather.wind ?? '–';

  card.hidden = false;
  showMessage('');
}

async function search(city) {
  showMessage(`Looking up the weather in ${city}…`);
  card.hidden = true;
  try {
    render(await getWeather(city));
  } catch (err) {
    showMessage(err.message, true);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (city) search(city);
});

input.value = DEFAULT_CITY;
search(DEFAULT_CITY);
loadCarousel(document.querySelector('#carousel'));
