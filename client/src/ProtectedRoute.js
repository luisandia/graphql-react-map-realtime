import React, { useContext } from 'react'
import Context from './context';
import { Route, Redirect } from 'react-router-dom';


const ProtectedRoute = (data) => {
    const { component: Component,
        ...rest } = data;
    console.log(data)
    const { state } = useContext(Context);
    console.log("geee")
    console.log(rest)
    return (
        <Route
            render={props => !state.isAuth ? <Redirect to="/login" /> : <Component {...props} />}
            {...rest}
        />
    )
}

export default ProtectedRoute;