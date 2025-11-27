import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [marsWeather, setMarsWeather] = useState(null);
  const API_KEY = 'bHBDhMJlfVc4mYYMCh9ZjabHd5Mcl5wS81O3sdfS'; 

  useEffect(() => {
    fetch(`https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`)
      .then(res => res.json())
      .then(data => setMarsWeather(data.sol_keys[0] ? data[data.sol_keys[0]] : null));
  }, []);

  if (!marsWeather) return <div>Loading Mars weather...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🌌 Mars Weather (Sol {marsWeather.First_UTC})</h1>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <div><strong>Season:</strong> {marsWeather.Season}</div>
        <div><strong>Temp (Avg):</strong> {marsWeather.AT?.av?.toFixed(1)}°C</div>
        <div><strong>Wind Speed (Avg):</strong> {marsWeather.HWS?.av?.toFixed(1)} m/s</div>
        <div><strong>Pressure (Avg):</strong> {marsWeather.PRE?.av?.toFixed(0)} Pa</div>
      </div>
    </div>
  );
}

export default App
