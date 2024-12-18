import React, { useEffect, useState } from "react";
import "./style.css"

const Tempapp = () => {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState("srinagar")
  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=02d45a985dc70fde2d95e178e66b8aa2`
      const response = await fetch(url);
      const resJson = await response.json();
      setCity(resJson.main);

    }


    fetchApi();
  }, [search])
  return (
    <>
      <div className="box">
        <div className="inputData">
          <input type="search"
            className="inputField" value={search} onChange={(event) => {
              setSearch(event.target.value)

            }} />
        </div>
        {
          !city ? (<p className="errorMsg">no data </p>) : (
            <div>
              <div className="info">
                <h1 className="location"><i className="fa-duotone fa-solid fa-sun"></i>{search}</h1>
                <h2 className="temp">{city.temp}°Celsius</h2>
                <h3 className="tempmin_max">min:{city.temp_min}°Celsius |max: {city.temp_max}°Celsius</h3>
              </div>

            </div>

          )}


      </div>
    </>
  )



}
export default Tempapp;