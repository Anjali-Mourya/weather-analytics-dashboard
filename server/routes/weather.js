const express = require('express');
const axios = require('axios');
const Search = require('../models/Search');
const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get('/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = response.data;

    await Search.findOneAndUpdate({ city }, { city, data }, { upsert: true, new: true });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'City not found!' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await Search.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json([]); // Return empty array instead of crashing
  }
});

module.exports = router;