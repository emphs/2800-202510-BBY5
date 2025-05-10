import { useNavigate } from '@tanstack/react-router';
import Footer from './partials/footer';
import { useEffect, useState } from 'react';

function IndexPage() {
    const navigate = useNavigate();
    const [weather, setWeather] = useState(null);

    // Fetch weather data
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('/location-data?lat=49.2827&lon=-123.1207'); // Example: Vancouver, BC
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
            <div
                className="w-100 d-flex flex-column justify-content-center align-items-center px-4"
                style={{
                    minHeight: '75vh',
                    backgroundColor: '#BFFFF0', // lighter version of #74F2CE
                    borderRadius: '1rem',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1 className="mb-4 display-4 fw-bold" style={{ color: '#080F0F' }}>
                    CivicFix
                </h1>
                <p className="mb-5 text-muted text-center">
                    Empowering citizens to report and track civic issues in their communities.
                </p>
                <div className="d-flex">
                    <button
                        className="btn me-3 px-4 py-2 fw-bold text-white mx-2"
                        style={{ backgroundColor: '#A52422' }}
                        onClick={() => navigate({ to: '/login' })}
                    >
                        Sign In
                    </button>
                    <button
                        className="btn px-4 py-2 fw-bold text-dark mx-2"
                        style={{ backgroundColor: '#8EB8E5' }}
                        onClick={() => navigate({ to: '/signup' })}
                    >
                        Sign Up
                    </button>
                </div>
                {/* Display Weather Information */}
                {weather && (
                    <div className="mt-4 text-center">
                        <h3>Weather Information</h3>
                        <p>City: {weather.cityName}</p>
                        <p>Temperature: {weather.temp}°C</p>
                        <p>Condition: {weather.weatherDesc}</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default IndexPage;