const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get weather data for location
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // If we have a weather API key, use it; otherwise return mock data
    if (process.env.WEATHER_API_KEY) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      
      const weatherData = {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0,
        description: response.data.weather[0].description,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure,
        forecast: generateFertilizerAdvice(response.data)
      };
      
      res.json(weatherData);
    } else {
      // Return mock weather data for development
      res.json({
        temperature: 24,
        humidity: 65,
        rainfall: 0,
        description: 'partly cloudy',
        windSpeed: 3.5,
        pressure: 1013,
        forecast: {
          nextRainDays: 3,
          recommendation: 'Good conditions for fertilizer application. Apply in early morning.',
          riskLevel: 'low'
        }
      });
    }
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// Get weather forecast
router.get('/forecast', authMiddleware, async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    if (process.env.WEATHER_API_KEY) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric&cnt=${days * 8}`
      );
      
      res.json(response.data);
    } else {
      // Return mock forecast data
      const mockForecast = [];
      for (let i = 0; i < days; i++) {
        mockForecast.push({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
          temperature: { min: 18 + Math.random() * 5, max: 25 + Math.random() * 5 },
          humidity: 60 + Math.random() * 20,
          rainfall: Math.random() > 0.7 ? Math.random() * 10 : 0,
          description: ['clear', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)]
        });
      }
      res.json({ list: mockForecast });
    }
  } catch (error) {
    console.error('Weather forecast error:', error.message);
    res.status(500).json({ message: 'Failed to fetch forecast data' });
  }
});

function generateFertilizerAdvice(weatherData) {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const isRaining = weatherData.weather.some(w => w.main === 'Rain');
  
  let advice = {
    nextRainDays: 3,
    recommendation: '',
    riskLevel: 'low'
  };
  
  if (isRaining) {
    advice.recommendation = 'Delay fertilizer application until rain stops to prevent runoff.';
    advice.riskLevel = 'high';
  } else if (temp > 30) {
    advice.recommendation = 'Apply fertilizer in early morning or evening to avoid heat stress.';
    advice.riskLevel = 'medium';
  } else if (windSpeed > 10) {
    advice.recommendation = 'High winds detected. Consider delaying application or use appropriate spreader settings.';
    advice.riskLevel = 'medium';
  } else {
    advice.recommendation = 'Optimal conditions for fertilizer application.';
    advice.riskLevel = 'low';
  }
  
  return advice;
}

module.exports = router;
