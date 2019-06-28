import React, { useContext } from "react";
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from 'graphql-request';
// import Typography from "@material-ui/core/Typography";

import Context from '../../context';

const ME_QUERY = `
{
  me{
    _id
    name
    email
    picture
  }
}
`;

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    console.log(idToken)
    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: { authorization: idToken }
    });

    const data = await client.request(ME_QUERY);
    // console.log({ data });
    dispatch({ type: "LOGIN_USER", payload: data.me })
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
