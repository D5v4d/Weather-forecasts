import React, { useState, useEffect } from "react";
import styleApp from "../scss/App.module.scss";
import styleMenu from "../scss/menu.module.scss";
import styleMain from "../scss/main.module.scss";
import { SearchCityInput, SearchButton, WeatherOverview, Title } from "./menu";
import { TitleMain, Week } from "./main";

import clearSky from "../svg/clearSky.svg";
import fewClouds from "../svg/fewClouds.svg";
import showerRain from "../svg/showerRain.svg";
import rain from "../svg/rain.svg";
import thunderstorm from "../svg/thunderstorm.svg";
import snow from "../svg/snow.svg";
import mist from "../svg/mist.svg";

const weatherIcons = {
  Clear: { svg: clearSky, img: require("../img/clearSky.png") },
  Clouds: { svg: fewClouds, img: require("../img/fewClouds.jpg") },
  Drizzle: { svg: showerRain, img: require("../img/showerRain.png") },
  Rain: { svg: rain, img: require("../img/rain.jpg") },
  Thunderstorm: {
    svg: thunderstorm,
    img: require("../img/thunderstorm.jpg"),
  },
  Snow: { svg: snow, img: require("../img/snow.jpg") },
  Mist: { svg: mist, img: require("../img/mist.jpg") },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [forecast, setForecast] = useState("Today");
  const [value, setValue] = useState("");
  const [geo, setGeo] = useState({ lat: null, lon: null });
  const [btn, setBtn] = useState({ btnInput: false, btnGeo: false });
  const [data, setData] = useState(null);
  const [icons, setIcons] = useState("");
  const [isError, setIsError] = useState(false);
  const [styleInput, setStyleInput] = useState({ 
    className: `${styleMenu.Input}`,
    text: "Введите город", 
  });

  const handleInputChange = (e) => {
    setValue(e.target.value.trim());
  };

  const handleInput = () => {
    if (value !== "") {
      setBtn({ btnInput: true, btnGeo: false });
    }
  };

  const handleGeo = () => {
    navigator.geolocation.getCurrentPosition(done, (error) => {
      setIsError(true);
      console.error("Error getting geolocation:", error.message);
    });
  };

  const done = (position) => {
    const { latitude, longitude } = position.coords;
    if (geo.lat !== latitude && geo.lon !== longitude) {
      setGeo({ lat: latitude, lon: longitude });
      setBtn({ btnInput: false, btnGeo: true });
    }
  };

  useEffect(() => {
    const weatherApi = async () => {
      try {
        setIsLoading(true);
        let response;
        let url;
        const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
        if (btn.btnGeo) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=metric&appid=${API_KEY}`;
        } else {
          const query = btn.btnInput ? value : "Батуми";
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${API_KEY}`;
          if (btn.btnInput) setValue("");
        }

        response = await fetch(url);
        let data = await response.json();

        if (data.cod === 200 || data.cod === "200") {
          setIsError(false);
          setData(data);

          let iconsCod = !data.list
            ? data.weather[0].main
            : data.list[0].weather[0].main;
            setIcons(weatherIcons[iconsCod]);
        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
        console.error("Произошла ошибка:", error);
      } finally {
        setIsLoading(false); // Конец загрузки
      }
    };
    weatherApi();
  }, [btn]);

  useEffect(() => {
    const className = isError && value === "" ? `${styleMenu.Input} ${styleMenu.InputError}` : `${styleMenu.Input}`;

    setStyleInput({ 
      className,
      text: isError && value === "" ? "Неверные данные" : "Введите город",
    });
  }, [isError, value]);

  const forecastActive = (tab) => {
    setForecast(tab);
  }
  
  return (
    <section className={styleApp.Weather} style={{ backgroundImage: `url(${icons.img})` }}>
      {isLoading && <p>Загрузка...</p>}
      <section className={styleMenu.Container}>
        <SearchCityInput
          text={styleInput.text}
          style={styleInput.className}
          value={value}
          onChange={handleInputChange}
        />
        <SearchButton className={styleMenu.SearchBtn} onButtonClick={handleInput}/>
        <WeatherOverview data={data} icons={icons.svg} />
        <Title className={styleMenu.GeoText} text="Geolocation search" />
        <SearchButton className={styleMenu.GeoBtn} onButtonClick={handleGeo} />
      </section>
      <section className={styleMain.Container}>
        <nav className={styleMain.DayNav}>
          <TitleMain className={`${styleMain.TitleBtn} ${forecast === "Today" ? styleMain.DayActive : ""}`} onButtonClick={() => forecastActive("Today")}  text="Today"  />
          <TitleMain className={`${styleMain.TitleBtn} ${forecast === "Week" ? styleMain.DayActive : ""}`} onButtonClick={() => forecastActive("Week")} text="Week" />
        </nav>
        <Week data={data} forecast={forecast} weatherIcons={weatherIcons} background={icons.img}/>
      </section>
    </section>
  );
}
