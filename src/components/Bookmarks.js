import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    bookmarksContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        flex: '1',
        minWidth: 200,
        gap: '2em',
        paddingLeft: '1em',
        paddingRight: '1em'
    },
    bookmarkBox: {
        minWidth: 200,
        margin: '10px 0',
        padding: '10px',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
    },
    section: {
        height: "100%",
        paddingTop: 5,
        color: theme.palette.text.primary,
    },
}));

function Bookmarks({ bookmarks, isBookmarksVisible, darkmode }) {
    const classes = useStyles();

    return (
        <>
            {
                isBookmarksVisible
                &&
                <Grid>
                    <Card className={classes.section} style={{ backgroundColor: darkmode ? '#000' : '#fff', color: darkmode ? 'white' : 'black' }}>
                        <div className={classes.bookmarksContainer} style={{ backgroundColor: darkmode ? '#000' : '#fff', color: darkmode ? 'white' : 'black' }}>
                            {bookmarks.map((bookmark, index) => (
                                <Card key={index} className={classes.bookmarkBox} style={{ backgroundColor: darkmode ? '#000' : '#fff', color: darkmode ? 'white' : 'black' }}>
                                    <div>{bookmark.icon && <img src={bookmark.icon} alt="" />} </div>
                                    <div> {bookmark.city},{bookmark.country} </div>
                                    <div> {bookmark.temp}°C </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Grid>
            }
        </>
    );
}

export default Bookmarks;
