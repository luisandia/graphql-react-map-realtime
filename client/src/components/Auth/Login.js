import React, { useContext } from "react";
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from 'graphql-request';
import Typography from "@material-ui/core/Typography";

import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';


const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      console.log(idToken)
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: { authorization: idToken }
      });


      const data = await client.request(ME_QUERY);
      // console.log({ data });
      dispatch({ type: "LOGIN_USER", payload: data.me })
    } catch (e) {
      onFailure(e);
    }
  }

  const onFailure = (error) => {
    console.error("Failure loggin ", error);
  }

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66,133,244)" }}>
        Welcome
    </Typography>
      <GoogleLogin
        clientId="1076905569446-nedm2j9cg8k4gf5g8ega71pscnlt2o23.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        theme="dark" />
    </div>
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
