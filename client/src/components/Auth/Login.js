import React from "react";
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {

  const onSuccess = googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    console.log(idToken)
  }

  return <GoogleLogin
    clientId="1076905569446-nedm2j9cg8k4gf5g8ega71pscnlt2o23.apps.googleusercontent.com"
    onSuccess={onSuccess}
    isSignedIn={true} />
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
