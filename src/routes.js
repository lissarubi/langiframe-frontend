import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'


import Editor from './pages/Editor'
import Iframe from './pages/iframe'

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Editor}></Route>
                <Route path="/iframe" exact component={Iframe}></Route>
            </Switch>
        </BrowserRouter>
    )
}