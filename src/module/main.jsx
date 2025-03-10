import styleMain from "../scss/main.module.scss";

export function TitleMain({ className, onButtonClick, text }) {
  return (
    <button className={className} onClick={onButtonClick}>
      {text}
    </button>
  );
}

export function Week({ data, forecast, weatherIcons, background}) {


  if (data && data.list && forecast) {
    let date = new Date();
      let formattedDate =
        forecast === "Today" ? date.toISOString().split("T")[0] : "12:00:00";

      // Фильтруем данные по текущей дате
      let arrayWeather = data.list.filter((item) =>
        item.dt_txt.includes(formattedDate)
      );

      // Возвращаем один большой элемент, содержащий все блоки
      return (
        <div className={styleMain.WeatherInformation}>
          {arrayWeather.map((e, index) => (
            <ArrayWeather
              data={arrayWeather}
              index={index}
              forecast={forecast}
              weatherIcons={weatherIcons}
              background={background}
              key={index}
            />
          ))}
        </div>
      );
  }
  return null; // Если данные отсутствуют, возвращаем null
}

const ArrayWeather = ({ data, index, forecast, weatherIcons, background }) => {

  const temp = data[index].main.temp;
  const description = data[index].weather[0].main;
  const feelsLike = data[index].main.feels_like
  const humidity = data[index].main.humidity
  const wind = data[index].wind.speed

  const timestamp = Date.parse(data[index].dt_txt.replace(" ", "T"));
  const date = new Date(timestamp);
  const dayMonth = `${date.getDate()} ${date.toLocaleDateString("ru-RU", { month: "long" })}`
  const hourЬinute = data[index].dt_txt.split(" ")[1].slice(0, 5)

  let dateInfo = forecast === "Today" ?  hourЬinute : dayMonth

  let formattedWeekday = date.toLocaleDateString("ru-RU", { weekday: "long"}).replace(',', '');
  formattedWeekday = formattedWeekday.charAt(0).toUpperCase() + formattedWeekday.slice(1);

  let svgWeatherIcons = weatherIcons[data[index].weather[0].main].svg

  return (
    // <div className={styleMain.WeatherData} style={{ backgroundImage: `url(${background})` }}>
    <div className={styleMain.WeatherData}>
      <div>{formattedWeekday}</div>
      <div>{dateInfo}</div>
      <div>{temp}°C</div>
      <div>
      <img
          src={svgWeatherIcons}
          alt="Weather"
          className={styleMain.Img__Weather}
        />
        <div>{description}</div>
      </div>
      <div>Oщущается как <div>{feelsLike}°C</div></div>
      <div>Влажность: {humidity}%</div>
      <div>Ветер: {wind} м/с</div>
    </div>
  );
};
