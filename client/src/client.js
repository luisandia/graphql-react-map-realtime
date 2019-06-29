import { GraphQLClient } from 'graphql-request';
import { useState, useEffect } from 'react'

export const BASE_URL = process.env.NODE_ENV === "production" ? "<insert-production-url>" : "http://localhost:4000/graphql"

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