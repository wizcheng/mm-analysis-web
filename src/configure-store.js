import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from "./configure-reducers";

export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        createRootReducer(history), // root reducer with router state
        preloadedState,
        composeEnhancer(
            applyMiddleware(
                routerMiddleware(history) // for dispatching history actions
            ),
        ),
    );
    return store
}