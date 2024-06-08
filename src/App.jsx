import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Weather from './components/weather';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "97ff617856b160741a9e2e64cf55d2f9";
  const defaultLocation = "New York";
  
  const fetchWeatherData = async (location) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData(location);
      setLocation("");
    }
  };

  useEffect(() => {
    fetchWeatherData(defaultLocation);
  }, []);

  return (
    <div className='w-full h-full relative'>
      <div className='text-center p-4'>
        <input
          type="text"
          className='py-3 px-6 w-[700px] text-lg rounded-3xl border border-gray-200 text-blue-400 placeholder:text-gray-400 focus:outline-none bg-gray-200/100 shadow-md'
          placeholder='Enter location'
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
        />
      </div>
      {loading ? (
        <div className="text-center text-blue-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : (
        <Weather weatherData={data} />
      )}
    </div>
  );
}

export default App;
