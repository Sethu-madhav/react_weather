import { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import Weather from './components/weather';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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

  const fetchSuggestions = async (value) => {
    if (!value) return [];
    const url = `https://api.openweathermap.org/data/2.5/find?q=${value}&type=like&sort=population&cnt=5&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data.list.map(location => ({
        name: location.name,
        country: location.sys.country,
      }));
    } catch (error) {
      return [];
    }
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await fetchSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white">
      {suggestion.name}, {suggestion.country}
    </div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    setLocation(suggestion.name);
    fetchWeatherData(suggestion.name);
  };

  const inputProps = {
    placeholder: 'Enter location',
    value: location,
    onChange: (event, { newValue }) => setLocation(newValue),
    onKeyDown: (event) => {
      if (event.key === "Enter") {
        fetchWeatherData(location);
        setLocation("");
      }
    },
    className: 'w-full py-3 px-6 text-lg rounded-3xl border border-gray-200 text-blue-400 placeholder:text-gray-400 focus:outline-none bg-gray-200/100 shadow-md'
  };

  useEffect(() => {
    fetchWeatherData(defaultLocation);
  }, []);

  return (
    <div className='w-full h-full relative'>
      <div className='text-center p-4'>
        <div className="relative mx-auto w-[700px]">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelected}
            inputProps={inputProps}
            theme={{
              container: 'relative',
              suggestionsContainer: 'absolute z-10 w-full bg-white border-gray-300 rounded-b-lg shadow-lg',
              suggestionsList: 'm-0 p-0 list-none',
              suggestion: 'px-4 py-2 cursor-pointer',
              suggestionHighlighted: 'bg-blue-500 text-white'
            }}
          />
        </div>
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
