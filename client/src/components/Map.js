import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Context from '../context';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}




const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  const [userPosition, setUserPosition] = useState(null);
  useEffect(() => {
    getUserPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getUserPosition = () => {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        debugger;
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude })
      },
        err => { console.error(err); })
    }
  }

  const handleMapClick = ({ lngLat, leftButton }) => {

    if (!leftButton) return;

    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" })
    }
    const [longitude, latitude] = lngLat;
    dispatch({ type: "UPDATE_DRAFT_LOCATION", payload: { longitude, latitude } })

  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiemFmaXJvbiIsImEiOiJjamRucDhoMjIwY2ZxMzJwa2h3cHhjZThzIn0.vVfzUwdgws2aEVWDhOEoMg"
        onViewStateChange={newViewport => setViewport(newViewport)}

        onClick={handleMapClick}
        {...viewport}
      >
        {/* navigation control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewStateChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {
          console.log(userPosition)
        }

        {/* Pin current position */}
        {
          userPosition &&
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />

          </Marker>
        }

        {/* draft new pin */}
        {
          state.draft && (
            <Marker
              latitude={state.draft.latitude}
              longitude={state.draft.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon size={40} color="hotpink" />

            </Marker>
          )
        }
      </ReactMapGL>
    </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
