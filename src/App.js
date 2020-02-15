import React from 'react';
import './App.css';
import CandleChart from "./candlestick-chart/CandleChart";
// import {Provider} from 'react-redux';
// import {store} from "./configure-store";
import HistoricalPriceLoader from "./equity-price-loader/HistoricalPriceLoader";
import FilterLink from "./FilterLink";
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'


function Price() {
    return (
        <div className="App">
            <Link to="/price/xxx/yyy/mmm/mmm">v1</Link>
            <Link to="/price/dddd/eee/mmm/mmm">v2</Link>
            <HistoricalPriceLoader/>
            <CandleChart height='500' width={1000}/>
        </div>
    )
}

function App({history}) {
  return (
      <ConnectedRouter history={history}>
          <div className="App">
              {/*<NavBar />*/}
              <Switch>
                  <Route exact path="/price/:ric?/:start?/:end?/:type?/:scale?" component={Price} />
                  <Route path="/hello" component={() => <div>hello</div>} />
                  <Route component={() => <div>404</div>} />
              </Switch>
          </div>
      </ConnectedRouter>
  );
}

export default App;
