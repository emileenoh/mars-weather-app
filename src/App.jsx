import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [marsWeatherData, setMarsWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'bHBDhMJlfVc4mYYMCh9ZjabHd5Mcl5wS81O3sdfS'; 

  useEffect(() => {
    fetch(`https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`)
      .then(res => res.json())
      .then(data => {
        if (data.sol_keys && data.sol_keys.length > 0) {
          // Sort sol keys numerically and get the last 7 (most recent)
          const sortedSolKeys = [...data.sol_keys].sort((a, b) => Number(a) - Number(b));
          const last7Sols = sortedSolKeys.slice(-7).reverse(); // Reverse to show newest first
          const solsData = last7Sols.map(solKey => ({
            sol: solKey,
            ...data[solKey]
          }));
          setMarsWeatherData(solsData);
        } else {
          setMarsWeatherData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading Mars weather data...</div>
      </div>
    );
  }

  if (!marsWeatherData || marsWeatherData.length === 0) {
    return (
      <div className="app-container">
        <div className="error">Unable to load weather data</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const currentSol = marsWeatherData[0];
  const previousSols = marsWeatherData.slice(1);

  return (
    <div className="app-container">
      <div className="weather-app">
        <header className="weather-header">
          <h1 className="app-title">Mars Weather</h1>
        </header>

        <hr role="presentation" />

        <div className="weather-main">
          <div className="weather-location">
            Elysium Planitia
          </div>

          {currentSol && (
            <div className="current-sol">
              <div>
              Sol {currentSol.sol} {currentSol.First_UTC && (
                  <span>({formatDate(currentSol.First_UTC)})</span>
                )} 
              </div>

              <div className="current-sol-content">
                <div className="current-sol-temp">
                  {currentSol.AT?.av ? `${currentSol.AT.av.toFixed(1)}°` : 'N/A'}
                </div>

                <div className="current-sol-temp-range">
                 Orange, dusty, and thin.{' '}
                  {currentSol.AT?.mn && currentSol.AT?.mx ? (
                    <span>
                      {currentSol.AT.mn.toFixed(1)}° / {currentSol.AT.mx.toFixed(1)}°
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="current-sol-metrics">
                <div className="current-sol-metric">
                  <span className="current-metric-label">Wind</span>
                  <span className="current-metric-value">
                    {currentSol.HWS?.av ? `${currentSol.HWS.av.toFixed(1)} m/s` : 'N/A'}
                  </span>
                </div>
                <div className="current-sol-metric">
                  <span className="current-metric-label">Pressure</span>
                  <span className="current-metric-value">
                    {currentSol.PRE?.av ? `${currentSol.PRE.av.toFixed(0)} Pa` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {previousSols.length > 0 && (
            <div className="sols-container">
              {previousSols.map((solData) => (
                <div key={solData.sol} className="sol-card">
                  <div className="sol-header">
                    <h2 className="sol-number">Sol {solData.sol}</h2>
                    {solData.First_UTC && (
                      <div className="sol-date">{formatDate(solData.First_UTC)}</div>
                    )}
                  </div>

                  <div className="sol-content">
                    <div className="sol-main-metric">
                      <div className="sol-temp">
                        {solData.AT?.av ? `${solData.AT.av.toFixed(1)}°C` : 'N/A'}
                      </div>
                      <div className="sol-temp-range">
                        {solData.AT?.mn && solData.AT?.mx ? (
                          <span>
                            {solData.AT.mn.toFixed(1)}° / {solData.AT.mx.toFixed(1)}°
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="sol-metrics">
                      <div className="sol-metric">
                        <span className="metric-label">Wind</span>
                        <span className="metric-value">
                          {solData.HWS?.av ? `${solData.HWS.av.toFixed(1)} m/s` : 'N/A'}
                        </span>
                      </div>
                      <div className="sol-metric">
                        <span className="metric-label">Pressure</span>
                        <span className="metric-value">
                          {solData.PRE?.av ? `${solData.PRE.av.toFixed(0)} Pa` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer>
          <p className="data-location">Data from NASA's <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noopener noreferrer">InSight Lander</a></p>
          <p>made by @emileenoh (github)</p>
        </footer>
      </div>
    </div>
  );
}

export default App
