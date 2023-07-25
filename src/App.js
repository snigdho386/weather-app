import React, { useState } from 'react';
import './App.css';
import axios from "axios";
import Search from './components/Search';
import { weatherForecast } from './Api'
import Weather from './components/Weather';
import Loader from './components/Loader';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { getImgDesc } from './getImgDesc.js'


// Style ----------------------------------------
const useStyles = makeStyles((theme) => ({
    toggleButton: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 9999,
    },
}));

// Component ------------------------------------
function App() {
    const classes = useStyles();

    const [historyData, setHistoryData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    let [state, setState] = useState({
        value: '',
        current: {
        },
        weekInfo: [],
        loading: false,
        error: false,
    });
    const [darkMode, setDarkMode] = useState(true);

    const handleInputChange = e => {
        setState({
            ...state,
            value: e.target.value,
        })
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    const handleSearchCity = async (e) => {
        e.preventDefault();
        setState({
            ...state,
            loading: true,
        })

        try {

            let locationResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${state.value}&language=en&format=json`);
            let lat = locationResponse.data.results[0]['latitude'];
            let long = locationResponse.data.results[0]['longitude'];
            let historyURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&past_days=10&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
            try {
                let historyRes = await axios.get(historyURL);
                let tempArrayMax = historyRes.data.daily.temperature_2m_max;
                let tempArrayMin = historyRes.data.daily.temperature_2m_min;
                let dateArray = historyRes.data.daily.time;
                let weatherCodeArray = historyRes.data.daily.weathercode;
                let temp = [];
                let currentDayImg = getImgDesc(weatherCodeArray[10])["image"];
                // console.log("gg", currentDayImg);
                for (let i = 3; i < 10; i++) {
                    let currentDataObj = {};
                    let imgDesc = getImgDesc(weatherCodeArray[i]);
                    currentDataObj["key"] = i;
                    currentDataObj["date"] = dateArray[i];
                    currentDataObj["max"] = tempArrayMax[i];
                    currentDataObj["min"] = tempArrayMin[i];
                    currentDataObj["weathercode"] = weatherCodeArray[i];
                    currentDataObj["img"] = imgDesc["image"];
                    currentDataObj["description"] = imgDesc["description"];
                    temp.push(currentDataObj);
                }
                setHistoryData(temp)
                temp.length = 0;
                for (let i = 10; i < 17; i++) {
                    let currentDataObj = {};
                    let imgDesc = getImgDesc(weatherCodeArray[i]);
                    currentDataObj["key"] = i;
                    currentDataObj["date"] = dateArray[i];
                    currentDataObj["max"] = tempArrayMax[i];
                    currentDataObj["min"] = tempArrayMin[i];
                    currentDataObj["weathercode"] = weatherCodeArray[i];
                    currentDataObj["img"] = imgDesc["image"];
                    currentDataObj["description"] = imgDesc["description"];
                    temp.push(currentDataObj);
                }
                setForecastData(temp)
                console.log(forecastData);
                try {
                    let currentRes = await axios.get(weatherForecast(state.value));
                    const data = currentRes.data
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    const currentDate = new Date()
                    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
                    const icon = currentDayImg
                    const current = {
                        city: data.city.name,
                        country: data.city.country,
                        date,
                        icon,
                        population: data.city.population,
                        desc: data.list[0].weather[0].description,
                        main: data.list[0].weather[0].main,
                        temp: data.list[0].temp.day,
                        hTemp: data.list[0].temp.max,
                        lTemp: data.list[0].temp.min,
                        clouds: data.list[0].clouds,
                        humidity: data.list[0].humidity,
                        wind: data.list[0].speed,
                        pressure: data.list[0].pressure,
                    }
                    setState({
                        current,
                        loading: false,
                        error: false,
                    })
                    try {
                        let hourlyRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,weathercode`)
                        let hourlyDateTimeArray = hourlyRes.data.hourly.time;
                        let hourlyTemperatureArray = hourlyRes.data.hourly.temperature_2m;
                        let hourlyWeatherCodeArray = hourlyRes.data.hourly.weathercode;
                        // console.log("hourly response", hourlyDateTimeArray, hourlyTemperatureArray, hourlyWeathercodeArray);
                        let temp = [];
                        for (let i = 0; i < 24; i++) {
                            let timeAtCurrentIndex = hourlyDateTimeArray[i].substring(11, 16);
                            let imgDesc = getImgDesc(hourlyWeatherCodeArray[i]);
                            let currentDataObj = {};
                            currentDataObj["time"] = timeAtCurrentIndex;
                            currentDataObj["temperature"] = hourlyTemperatureArray[i];
                            currentDataObj["img"] = imgDesc["image"];
                            currentDataObj["description"] = imgDesc["description"];
                            temp.push(currentDataObj);
                        }
                        setHourlyData(temp);

                    } catch (error) {
                        console.log("Error", error);
                        setState({
                            ...state,
                            loading: false,
                            error: true,
                            current: {},
                        })
                    }



                } catch (error) {
                    console.log("Error", error);
                    setState({
                        ...state,
                        loading: false,
                        error: true,
                        current: {},
                    })
                }

            } catch (error) {
                console.log("Error", error);
                setState({
                    ...state,
                    loading: false,
                    error: true,
                    current: {},
                })
            }

        } catch (error) {
            console.log("Error", error);
            setState({
                ...state,
                loading: false,
                error: true,
                current: {},
            })

        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: darkMode ? 'black' : 'white', height: '100vh', overflow: 'hidden', color: darkMode ? 'white' : 'black' }}>
            <Search
                value={state.value}
                data={state}
                showResult={(state.weatherInfo || state.error) && true}
                change={handleInputChange}
                submit={handleSearchCity}
                darkmode={darkMode}
            />
            {
                state.loading === true ?
                    <Loader /> :
                    <div>
                        {state.current.country !== undefined ?
                            <div className="weather">
                                <Weather today={state.current} weekly={forecastData} historyData={historyData} hourlyData={hourlyData} darkmode={darkMode} />
                            </div> :
                            state.error ?
                                <p className="error__loc">Sorry! we don't have any information on specified location.</p> :
                                <div>

                                </div>
                        }
                    </div>
            }
            <IconButton
                className={classes.toggleButton}
                onClick={toggleDarkMode}
                color="inherit"
                size='large'
            >
                <Brightness4Icon fontSize='large' style={{ position: 'absolute', top: '0px', right: '0px' }} />
            </IconButton>
        </div>
    )
}

export default App;
