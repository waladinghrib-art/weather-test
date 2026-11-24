// Frontend code: this runs in the browser.
// It talks to OUR backend (/api/weather), never directly to Open-Meteo.
import { describeWeather } from './weatherCodes.js';

export async function getWeather(city) {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return toCard(data);
}

// TODO 2: pick the right fields from the JSON our backend sends.
//
// The JSON looks like this:
// {
//   "city": "Tunis",
//   "country": "Tunisia",
//   "current": {
//     "temperature_2m": 20.2,
//     "relative_humidity_2m": 51,
//     "wind_speed_10m": 5.4,
//     "weather_code": 1
//   }
// }
//
// The first field is done for you. Fill in the others the same way.
// For "weather", give describeWeather() the weather code: it returns { text, emoji }.
export function toCard(data) {
  return {
    city: data.city,
    country: '', // at the top level, like city
    temperature: null, // inside data.current, in °C
    humidity: null, // inside data.current, in %
    wind: null, // inside data.current, in km/h
    weather: null, // describeWeather( ...the weather code... )
  };
}
