// This file runs on the SERVER (a Vercel serverless function), never in the browser.
// It is the waiter from the restaurant: the browser asks it for the weather in a city,
// and it does the work with Open-Meteo (free, no API key needed):
//   1. find the city's coordinates (geocoding API)
//   2. get the current weather at those coordinates (forecast API)

export default async function handler(req, res) {
  const city = req.query.city || 'Tunis';

  try {
    // Step 1: city name → latitude and longitude. This one is done for you.
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geo = await (await fetch(geoUrl)).json();
    const place = geo.results?.[0];

    if (!place) {
      return res.status(404).json({ error: `City not found: "${city}". Check the spelling.` });
    }

    // TODO 1: build the Open-Meteo forecast URL.
    //
    // Docs: https://open-meteo.com/en/docs
    // A URL has 4 parts (Block 3!):
    //   protocol + domain : https://api.open-meteo.com
    //   path              : /v1/forecast
    //   query             : latitude=...  longitude=...  current=...
    //
    // Use place.latitude and place.longitude, and ask for these current values:
    //   current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code
    // Hint: look at geoUrl above, it is built the same way.
    // ⚠️ Use backticks ` ` (not quotes ' '), otherwise ${...} is not replaced by the value.
    const weatherUrl = '';

    if (!weatherUrl) {
      return res.status(501).json({ error: 'TODO 1 is not done yet: build the forecast URL in api/weather.js' });
    }

    const response = await fetch(weatherUrl);
    const weather = await response.json();

    if (!response.ok) {
      // Open-Meteo explains what went wrong, e.g. a typo in the URL (400).
      return res.status(response.status).json({ error: weather.reason || 'Open-Meteo returned an error.' });
    }

    return res.status(200).json({
      city: place.name,
      country: place.country,
      current: weather.current,
    });
  } catch {
    return res.status(502).json({
      error: 'Could not reach Open-Meteo. Check the URL in TODO 1 (backticks ` `, not quotes) and your internet connection.',
    });
  }
}
