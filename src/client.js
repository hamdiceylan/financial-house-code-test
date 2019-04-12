import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router
} from 'react-router';
import deepForceUpdate from 'react-deep-force-update';
import {
  createPath
} from 'history/PathUtils';
import history from './history';
import App from './components/App.jsx';
import configureStore from './store/configureStore';
import theme from './styles/theme.scss';

theme._insertCss();
const context = {
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  },

  store: configureStore(window.App.state, {
    history
  }),
  storeSubscription: null,
};

const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete() {
  const elem = document.getElementById('css');
  if (elem) elem.parentNode.removeChild(elem);

  onRenderComplete = function renderComplete(location) {
    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location.key];
    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location.hash.substr(1);
      if (targetHash) {
        const target = document.getElementById(targetHash);
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    window.scrollTo(scrollX, scrollY);

    if (window.ga) {
      window.ga('send', 'pageview', createPath(location));
    }
  };
};

const container = document.getElementById('app');
let appInstance;
let currentLocation = history.location;

async function onLocationChange(location, action) {
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;

  try {
    if (currentLocation.key !== location.key) {
      return;
    }

    appInstance = ReactDOM.render( <Router 
      history = {
        history
      }>
      <App store = {
        context.store
      }
      context = {
        context
      }
      /> 
      </Router> ,
      container,
      () => onRenderComplete(location),
    );
  } catch (error) {
    if (__DEV__) {
      throw error;
    }

    console.error(error);

    if (action && currentLocation.key === location.key) {
      window.location.reload();
    }
  }
}

history.listen(onLocationChange);
onLocationChange(currentLocation);

if (module.hot) {
  module.hot.accept('./components/App.jsx', () => {
    if (appInstance) {
      deepForceUpdate(appInstance);
    }
    onLocationChange(currentLocation);
  });
}
