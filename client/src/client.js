import { GraphQLClient } from 'graphql-request';
import { useState, useEffect } from 'react'

// export const BASE_URL = process.env.NODE_ENV === "production" ? "https://graphql-react-map-realtime.herokuapp.com" : `http://${process.env.REACT_APP_GRAPHQL_URL}`

export const BASE_URL =`http://${process.env.REACT_APP_GRAPHQL_URL}`

console.log(BASE_URL)
export const useClient = () => {
    const [idToken, setdIdToken] = useState("")

    useEffect(() => {
        const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
        setdIdToken(idToken);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
    });
}