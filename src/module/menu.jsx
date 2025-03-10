import styleMenu from "../scss/menu.module.scss";

export function SearchCityInput({text, style, value, onChange }) {
  return (
    <input
      type="text"
      className={style}
      value={value}
      onChange={onChange}
      placeholder={text}
    />
  );
}

export function SearchButton({ className, onButtonClick }) {
  return (
    <button className={className} onClick={onButtonClick}>Поиск</button>
  );
}

export function Title({ className, text }) {
  return <h1 className={className}>{text}</h1>;
}

export function WeatherOverview({ data , icons}) {
  if (data){
    let nameCity = data.list ? data.city.name : data.name;
    let nameTemp = data.list ? data.list[0].main.temp : data.main.temp;
    return (
      <div className={styleMenu.WeatherOverview}>
        <h1 className={styleMenu.City}>{nameCity}</h1>
        <img
          src={icons}
          alt="Weather"
          className={styleMenu.Img__Weather}
        />
        <span className={styleMenu.Degrees}>{nameTemp}°C</span>
        <h1 className={styleMenu.DayText}>Today</h1>
      </div>
    );
  }   
}
