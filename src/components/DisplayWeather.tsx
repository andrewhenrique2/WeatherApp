import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { SiWindicss } from "react-icons/si";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsCloudFog2Fill,
  BsFillCloudRainFill,
} from "react-icons/bs";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiLoaderFill } from "react-icons/ri";
import { MainWrapper } from "./style.module";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const DisplayWeather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchCity, setSearchCity] = useState<string>("");

  const api_key = "34537c99549b8d46660206c3a9772909";
  const apiEndpoint = "https://api.openweathermap.org/data/2.5/";

  const fetchCurrentWeather = useCallback(async (lat: number, lon: number) => {
    const url = `${apiEndpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get<WeatherData>(url);
    return response.data;
  }, [apiEndpoint, api_key]);

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${apiEndpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get<WeatherData>(url);
      return searchResponse.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchWeatherData(searchCity);
      setWeatherData(data);
    } catch (error) {
      console.error("Erro ao buscar dados de clima:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const currentWeather = await fetchCurrentWeather(latitude, longitude);
        setWeatherData(currentWeather);
        setIsLoading(false);
      });
    };

    fetchData();
  }, [fetchCurrentWeather]);

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "Rain":
        return <BsFillCloudRainFill />;
      case "Clear":
        return <BsFillSunFill />;
      case "Clouds":
        return <BsCloudyFill />;
      case "Mist":
        return <BsCloudFog2Fill />;
      default:
        return <TiWeatherPartlySunny />;
    }
  };

  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            placeholder="Enter a city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">
            <RiLoaderFill className="loadingIcon" />
            <p>Loading</p>
          </div>
        ) : weatherData ? (
          <div className="weatherArea">
            <h1>{weatherData.name}</h1>
            <span>{weatherData.sys.country}</span>
            <div className="icon">{getWeatherIcon(weatherData.weather[0].main)}</div>
            <h1>{weatherData.main.temp.toFixed(0)}</h1>
            <h2>{weatherData.weather[0].main}</h2>

            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidInfo">
                  <h1>{weatherData.main.humidity}%</h1>
                  <p>Humidity</p>
                </div>
              </div>

              <div className="wind">
                <SiWindicss className="windIcon" />
                <div className="humidInfo">
                  <h1>{weatherData.wind.speed}km/h</h1>
                  <p>Wind speed</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </MainWrapper>
  );
};

export default DisplayWeather;
