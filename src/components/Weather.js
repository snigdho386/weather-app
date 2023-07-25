import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import LocalInfo from './LocalInfo';
import Today from './Today';
import Weekly from './Weekly';
import History from './History';
import './TabComponent.css';
import Hourly from './Hourly';
import Bookmarks from './Bookmarks';

// Style ----------------------------------------
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '15em',
        marginRight: '15em',
        flexGrow: 1,
        padding: 15,
        color: theme.palette.text.primary,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
        marginBottom: '20px',
    },
    todayContainer: {
        flex: '1',
        minWidth: 200,
    },
    section: {
        height: '100%',
        width: '100%',
        paddingTop: 5,
        color: theme.palette.text.primary,
        flex: 1,
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
    },
    tabContainer: {
        marginTop: '2vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    button: {
        flex: 1,
        borderRadius: '5px',
    },
    fullWidthCard: {
        flex: '100%',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
}));

// Component ------------------------------------
function Weather({ today, weekly, historyData, hourlyData, darkmode }) {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState('tab1');
    const [bookmarks, setBookmarks] = useState([]);
    const [isBookmarksVisible, setIsBookmarksVisible] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.fullWidthCard}>
                    <Card
                        style={{
                            backgroundColor: darkmode ? '#000' : '#fff',
                            color: darkmode ? 'white' : 'black',
                        }}
                    >
                        <Today
                            today={today}
                            bookmarks={bookmarks}
                            setBookmarks={setBookmarks}
                            setIsBookmarksVisible={setIsBookmarksVisible}
                            darkmode={darkmode}
                        />
                    </Card>
                </div>
                <Bookmarks
                    bookmarks={bookmarks}
                    isBookmarksVisible={isBookmarksVisible}
                    darkmode={darkmode}
                />
            </div>

            <div className={classes.section}>
                <Card
                    className={classes.section}
                    style={{
                        backgroundColor: darkmode ? '#000' : '#fff',
                        color: darkmode ? 'white' : 'black',
                    }}
                >
                    <Hourly hourlyData={hourlyData} />
                </Card>
            </div>

            <div className={classes.tabContainer}>
                <div className={classes.buttonGroup}>
                    <button
                        className={`${classes.button} ${
                            activeTab === 'tab1' ? 'active' : ''
                            }`}
                        style={{
                            backgroundColor: activeTab === 'tab1' ? 'orangered' : darkmode ? '#000' : '#fff',
                            color: activeTab === 'tab1' ? '#fff' : darkmode ? 'white' : 'black',
                        }}
                        onClick={() => handleTabClick('tab1')}
                    >
                        Forecast
                    </button>
                    <button
                        className={`${classes.button} ${
                            activeTab === 'tab2' ? 'active' : ''
                            }`}
                        style={{
                            backgroundColor: activeTab === 'tab2' ? 'orangered' : darkmode ? '#000' : '#fff',
                            color: activeTab === 'tab2' ? '#fff' : darkmode ? 'white' : 'black',
                        }}
                        onClick={() => handleTabClick('tab2')}
                    >
                        History
                    </button>
                </div>
                <div>
                    {activeTab === 'tab1' && (
                        <div>
                            <Card
                                className={classes.section}
                                style={{
                                    backgroundColor: darkmode ? '#000' : '#fff',
                                    color: darkmode ? 'white' : 'black',
                                }}
                            >
                                <Weekly weekData={weekly} />
                            </Card>
                        </div>
                    )}
                    {activeTab === 'tab2' && (
                        <div>
                            <Card
                                className={classes.section}
                                style={{
                                    backgroundColor: darkmode ? '#000' : '#fff',
                                    color: darkmode ? 'white' : 'black',
                                }}
                            >
                                <History historyData={historyData} />
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Weather;
