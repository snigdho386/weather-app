import React, { useEffect, useState } from 'react'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import pressure from '../assets/pressure.svg'
import wind_speed from '../assets/wind_speed.svg'
import humidity from '../assets/humidity.svg'
import sunrise from '../assets/sunrise.svg'
import sunset from '../assets/sunset.svg'
import CardContent from '@material-ui/core/CardContent';
import { getImgDesc } from '../getImgDesc.js'
import { weatherForecast } from '../Api'


// Style ----------------------------------------
const useStyles = makeStyles((theme) => ({
    unit__icon: {
        width: 22,
        height: 22,
        alignSelf: 'center',
        marginRight: 4,
        marginLeft: 20,
    },
    unit__icon1: {
        width: 22,
        height: 22,
        alignSelf: 'center',
        fontSize: '8',
    },
    weather__icon: {
        width: 90,
        height: 90,
        Top: 0,
    },
    main: {
        overflow: 'auto',
        padding: 5,
    },
    text__left: {
        float: 'left',
    },
    text__right: {
        float: 'right',
    },
    span: {
        fontWeight: 'bold',
    },
    btn: {
        display: 'inline-block',
        backgroundColor: 'orangered',
        marginLeft: '1em',
        borderRadius: '5px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        color: theme.palette.text.primary,

    },

}));

// Component ------------------------------------
function Today({ today, bookmarks, setBookmarks, setIsBookmarksVisible, darkmode }) {
    const classes = useStyles();

    // Return weather list for a list of cities --------
    const fetchFavCityWeather = async (cityList) => {
        let favCityWeatherList = [];

        for (let city of cityList) {
            city = city.split('-')[0];

            let locationResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=en&format=json`);
            let lat = locationResponse.data.results[0]['latitude'];
            let long = locationResponse.data.results[0]['longitude'];

            let weatherDataRespnose = await axios.get(weatherForecast(city));
            let data = weatherDataRespnose.data;
            let openMeteoWeatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`);
            let icon = getImgDesc(openMeteoWeatherResponse.data.current_weather.weathercode)["image"];
            let weatherData = {
                city: data.city.name,
                country: data.city.country,
                temp: data.list[0].temp.day,
                icon
            }

            favCityWeatherList.push(weatherData);
        }

        return favCityWeatherList;
    }

    // Triggerd when you add a city to Favourites -------
    let toggleFavourite = async () => {
        console.log("Triggered");

        let bookmarksCityList = [];
        let cityCountryKey = `${today.city}-${today.country}`;

        try {
            const bookmarksFromLocalStorage = localStorage.getItem('bookmarks');
            if (bookmarksFromLocalStorage) {
                bookmarksCityList = JSON.parse(bookmarksFromLocalStorage);
                // bookmarksCityList = bookmarksFromLocalStorage;
            }

        } catch (error) {
            console.error('Error parsing bookmarks from localStorage:', error);
        }

        if (bookmarksCityList.length === 3) {
            //TODO: Popup Error
            console.log('ERROR');
        }
        else if (bookmarksCityList.includes(cityCountryKey)) {
            bookmarksCityList = bookmarksCityList.filter(city => city !== cityCountryKey);
        }
        else {
            bookmarksCityList.push(cityCountryKey);
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarksCityList));

        let bookmarksWeatherList = await fetchFavCityWeather(bookmarksCityList);

        setBookmarks(bookmarksWeatherList);
    }

    useEffect(() => {
        const checkAndToggleBookmarkVisibility = async () => {
            let bookmarksCityList = [];

            try {
                const bookmarksFromLocalStorage = localStorage.getItem('bookmarks');
                console.log('1. bookmarksCityList :::::::: ', bookmarksFromLocalStorage)
                if (bookmarksFromLocalStorage) {
                    bookmarksCityList = JSON.parse(bookmarksFromLocalStorage);
                    let bookmarksWeatherList = await fetchFavCityWeather(bookmarksCityList);

                    // console.log('bookmarksWeatherList :::::::::::: ', bookmarksWeatherList)
                    setBookmarks(bookmarksWeatherList);
                }
                console.log('2. bookmarksCityList :::::::: ', bookmarksFromLocalStorage)

            } catch (error) {
                console.error('Error parsing bookmarks from localStorage:', error);
            }

            if (bookmarksCityList.length === 3) {
                //TODO: Popup Error
                console.log('ERROR');
            }
        }
        checkAndToggleBookmarkVisibility();

    }, []);

    useEffect(() => {
        if (bookmarks.length) {
            setIsBookmarksVisible(true);
        } else {
            setIsBookmarksVisible(false);
        }

    }, [bookmarks]);

    return (
        <CardContent>
            <div className={classes.main}
                style={{
                    backgroundColor: darkmode ? '#000' : '#fff',
                    color: darkmode ? 'white' : 'black',
                }}
            >
                <div className={classes.text__left}>
                    <Typography variant="h5" style={{ color: 'orangered' }} gutterBottom>
                        {today.city}, {today.country}
                        <div className={classes.btn} onClick={toggleFavourite}
                            style={{
                                color: darkmode ? 'white' : 'black',
                            }}
                        >
                            <button>
                                {bookmarks.some(cityData => cityData.city === today.city && cityData.country === today.country) ? 'Remove from Fav' : 'Add to Fav'}
                            </button>
                        </div>
                    </Typography>

                    <Typography variant="h5" gutterBottom >
                        {today.temp}°C
                    </Typography>

                    <Typography variant="h6" gutterBottom>
                        {today.main}, {today.desc}
                    </Typography>
                </div>

                <div className={classes.text__right}>
                    <img src={today.icon} alt={today.icon} className={classes.weather__icon} />
                </div>
            </div>
            <div>
                <img src={pressure} alt="Logo" className={classes.unit__icon1} /><span className={classes.span}>{today.pressure} hPa</span>
                <img src={humidity} alt="Logo" className={classes.unit__icon} /><span className={classes.span}>{today.humidity} %</span>
                <img src={wind_speed} alt="Logo" className={classes.unit__icon} /><span className={classes.span}>{today.wind} m/s N</span>
            </div>
        </CardContent>
    )
}

export default Today;
