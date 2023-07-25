import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import { CardMedia } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    gridList: {
        flexWrap: 'nowrap',
        alignContent: 'center',
    },
    weather__icon: {
        width: 50,
        height: 50,
        top: 0,
        transform: 'translateY(0%)',
        left: 0,
    },
    day: {
        textAlign: 'center',
        minWidth: '50px',
    },
    info: {
        fontSize: 15,
        fontWeight: "bold",
    }
}));
function Hourly({ hourlyData }) {
    const classes = useStyles();
    return (
        <div className="hourly">
            <CardMedia className={classes.root}>
                <GridList className={classes.gridList} cellHeight="auto" spacing={1}>
                    {hourlyData.map((data) => (
                        <GridListTile cols={0.25} className={classes.day}>
                            <img
                                src={data.img}
                                alt={data.icon}
                                className={classes.weather__icon}
                            />
                            <Typography gutterBottom className={classes.info}>
                                {data.temperature}°C
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {data.time}
                            </Typography>
                            <h5 style={{ fontWeight: 'bold', paddingBottom: '2px' }}>{data.description}</h5>
                        </GridListTile>
                    ))}
                </GridList>
            </CardMedia>
        </div>
    )
}

export default Hourly