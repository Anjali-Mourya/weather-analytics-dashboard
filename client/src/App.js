import React, { useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/weather/${city}`);
      setWeather(res.data);
    } catch (err) {
      setError('City not found or server error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dailyData = weather ? weather.list.filter((_, i) => i % 8 === 0) : [];

  const tempChart = {
    labels: dailyData.map(d => new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Temperature (°C)',
      data: dailyData.map(d => Math.round(d.main.temp)),
      borderColor: '#93c5fd',
      backgroundColor: 'rgba(147, 197, 253, 0.25)',
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 8,
    }]
  };

  const precipChart = {
    labels: dailyData.map(d => new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Precipitation (mm)',
      data: dailyData.map(d => d.rain ? d.rain['3h'] || 0 : 0),
      backgroundColor: '#93c5fd'
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#ffffff' }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#e5e7eb' }
      },
      y: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#e5e7eb' }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="dark bg-gray-950 text-white min-h-screen relative overflow-hidden">
      {/* Subtle animated background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-1 z-0 blur-[px]"
        style={{
          backgroundImage: "url('/images.jpeg')"   // ← correct
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10 max-w-7xl">
       <motion.div
  className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-12"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-center flex-1">
    Weather Dashboard
  </h1>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            placeholder="Search city (e.g. Ludhiana, Chandigarh, Mumbai)"
            className="flex-1 px-5 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-gray-700 bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md text-white placeholder-gray-400"
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </motion.div>

        {error && (
          <motion.p
            className="text-red-400 text-center font-medium mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        {weather && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Current Weather Card */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 bg-gray-900 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center border border-gray-800"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                {weather.city.name}, {weather.city.country}
              </h2>
              <img
                src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@4x.png`}
                alt="weather icon"
                className="w-32 sm:w-40 mx-auto animate-bounce-slow"
              />
              <p className="text-5xl sm:text-6xl font-extrabold my-4 text-white">
                {Math.round(weather.list[0].main.temp)}°C
              </p>
              <p className="text-xl sm:text-2xl capitalize text-gray-300 mb-6">
                {weather.list[0].weather[0].description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-left text-sm sm:text-base">
                <div>
                  <p className="text-gray-400">Feels like</p>
                  <p className="font-semibold text-white">
                    {Math.round(weather.list[0].main.feels_like)}°C
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Humidity</p>
                  <p className="font-semibold text-white">
                    {weather.list[0].main.humidity}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Wind</p>
                  <p className="font-semibold text-white">
                    {weather.list[0].wind.speed} m/s
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Pressure</p>
                  <p className="font-semibold text-white">
                    {weather.list[0].main.pressure} hPa
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Temperature Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white">
                7-Day Temperature Forecast
              </h3>
              <Line data={tempChart} options={chartOptions} />
            </motion.div>

            {/* Precipitation Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white">
                Precipitation Forecast
              </h3>
              <Bar data={precipChart} options={chartOptions} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;