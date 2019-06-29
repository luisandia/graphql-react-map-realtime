import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { Subscription } from 'react-apollo';
import { PIN_ADDED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION, PIN_DELETED_SUBSCRIPTION } from '../graphql/subscriptions';

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import differenceInMinutes from 'date-fns/difference_in_minutes'

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}




const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  const [userPosition, setUserPosition] = useState(null);
  useEffect(() => {
    getUserPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getPins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [popup, setPopup] = useState(null);

  const getUserPosition = () => {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude })
      },
        err => { console.error(err); })
    }
  }

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins });
  }

  const handleMapClick = ({ lngLat, leftButton }) => {

    if (!leftButton) return;

    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" })
    }
    const [longitude, latitude] = lngLat;
    dispatch({ type: "UPDATE_DRAFT_LOCATION", payload: { longitude, latitude } })

  }

  const highlightNewPin = (pin) => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "limegreen" : "darkblue"
  }

  const handleSelectPin = (pin) => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin });

  }

  const isAuthUser = () => {
    if (!popup.author) {
      return false
    }
    return state.currentUser._id === popup.author._id
  }
  const handleDeletePin = async (pin) => {
    const variables = { pinId: pin._id }
    await client.request(DELETE_PIN_MUTATION, variables);
    setPopup(null);
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

        {/* pin list */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40} color={highlightNewPin(pin)} />
          </Marker>
        ))}

        {/* popup dialog */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image} alt={popup.title} />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}
                {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}


      </ReactMapGL>

      {/* subscription /Add / Create /delete Pin */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data
          dispatch({ type: "CREATE_PIN", payload: pinAdded })
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated })
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data
          dispatch({ type: "DELETE_PIN", payload: pinDeleted })
        }}
      />


      {/* Blog area to add pin content */}
      <Blog />
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
