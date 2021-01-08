import React from 'react'
import { useHistory, withRouter, Redirect, BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App.js";
import Taskpage from "./Taskpage.js";

export default function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <Route component = {Taskpage} path = "/Taskpage" exact/>
                <Route component = {App} path = "/" exact/>
            </Switch>
        </BrowserRouter>
    );
}
