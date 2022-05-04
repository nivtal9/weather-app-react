import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [flagURL, setFlagURL] = useState('');
  const [currTime, setCurrTime] = useState('');
  var [background, setBackground] = useState('');


  const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=0eb35f3c632280096f5115f275d4b469`;
  const flagAPI=`https://countryflagsapi.com/svg/`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(weatherAPI).then((response) => {
        setData(response.data);
        setFlagURL(flagAPI + response.data.sys.country);

        var currTime=Math.round(new Date().getTime()/1000)
        currTime+=response.data.timezone;
        var date = new Date(currTime*1000);
        var timeString = date.toISOString();
        setCurrTime(timeString.substring(11,16));
        var hours=timeString.substring(11,13);
        console.log(hours);
        if(5<hours && hours<12){
          console.log("morning");
          setBackground("url(./assets/morning.jpg)");
        }
        else if(11<hours && hours<18){
          console.log("mid-day");
          setBackground("url(./assets/mid-day.jpg)");
        }
        else if((17<hours && hours<23) || (-1<hours && hours<6)){
          console.log("night");
          setBackground("url(./assets/night.jpg)");
        }
      })
      setLocation('');
    }
  }

  return (
    <div className="app" style={{backgroundImage: `url(${background})`}}>
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
          <button>favorits</button>
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name? [data.name,", ", data.sys.country, ", ", currTime] : null}</p>
            {flagURL ? <img className="flag" src={flagURL} alt="flag" style={{width: 100, height: 50}}></img> : null}
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}&#8451;</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined &&
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}&#8451;</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} KM/h</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }



      </div>
    </div>
  );
}

export default App;