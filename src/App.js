import React, { useState } from 'react'
import axios from 'axios'
import midDay from "./assets/mid-day.jpg"
import morning from "./assets/morning.jpg"
import night from "./assets/night.jpg"
import defaultPic from "./assets/default.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faBookmark } from '@fortawesome/free-regular-svg-icons'

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [flagURL, setFlagURL] = useState('');
  const [currTime, setCurrTime] = useState('');
  const [favListShow, setFavListShow] = useState(false);
  const [list, setList] = useState([]);
  const [item, setItem] = useState("");
  const [background, setBackground] = useState(defaultPic);
// TODO - borders to text so it can be seen and cancel transpernt background in search box and favorits button

  const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=0eb35f3c632280096f5115f275d4b469`;
  const flagAPI=`https://countryflagsapi.com/svg/`;

  const favButton = () =>{
    if(!list.includes(item)&&item!==''&&list.length<=5){
      let tempArr = list;
      tempArr.push(item);
      setList(tempArr);
      localStorage.setItem("favorits", JSON.stringify(list));
    }
  }
  const bookmark = () =>{
    setFavListShow(!favListShow);
    setList(JSON.parse(localStorage.getItem("favorits")));
  }

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
        if(5<hours && hours<12){
          console.log("morning");
          setBackground(morning);
        }
        else if(11<hours && hours<18){
          console.log("mid-day");
          setBackground(midDay);
        }
        else if((17<hours && hours<23) || (-1<hours && hours<6)){
          console.log("night");
          setBackground(night);
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
            onChange={event => {setLocation(event.target.value); setItem(event.target.value)}}
            // setItem(event.target.value)
            onKeyPress={searchLocation}
            placeholder='Enter Location'
            type="text" />
          <button onClick={favButton} className='addFav'><FontAwesomeIcon icon={faStar}/><div className='tooltip'>Add to Bookmarks</div></button>
          <div>
            <button onClick={bookmark} className='bookmark'><FontAwesomeIcon icon={faBookmark}/><div className='tooltip'>Bookmarks (max 5)</div></button>
            <div className="favList">{favListShow?<ul> {list.length > 0 && list.map((item) => <li> {item} </li>)} </ul> :null }
            </div>
          </div>
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