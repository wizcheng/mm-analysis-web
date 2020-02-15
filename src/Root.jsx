import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import App from './App'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './configure-store'

const Root = ({store}) => (
    <Provider store={store}>
        <ConnectedRouter history={history}> { /* place ConnectedRouter under Provider */ }
            <Router>
                <Route path="/:symbol/:from/:to/:type/:scale" component={App}/>
                <Redirect from="/" to="/1858.HK/2019-08-01/2020-08-01/daily/linear" />
            </Router>
        </ConnectedRouter>
    </Provider>
);

export default Root