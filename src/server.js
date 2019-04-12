import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import nodeFetch from 'node-fetch';
import React from 'react';
import { StaticRouter } from 'react-router';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './pages/error/ErrorPage';
import errorPageStyle from './pages/error/ErrorPage.scss';
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { receiveLogin, receiveLogout } from './actions/user';
import config from './config';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import theme from './styles/theme.scss';
import request from 'request';

const app = express();

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const apiDomain = 'https://sandbox-reporting.rpdpymnt.com';


if (__DEV__) {
  app.enable('trust proxy');
}

app.post('*', (req, res, next) => {

  var options = {                 
    method: 'POST',             
    uri: `${apiDomain}/${req.originalUrl}`,
    form: req.body,
    headers: {}
  };   
  if (req.headers.authorization) {
      options.headers = {
        'Authorization': req.headers['authorization']
      }
  }

  request.post(options, function (error, response, body) {
    let statusCode = response && response.statusCode; 
    if(statusCode)
      res.status(statusCode).json(body);
    else 
      res.status(404);  
  });

});

app.post('/api/client', async (req, res, next) => {
  res.status(200).json(
    {
      "customerInfo": {
          "id": 706784,
          "created_at": "2018-10-12 15:12:24",
          "updated_at": "2018-10-12 15:12:24",
          "deleted_at": null,
          "number": "411111XXXXXX1111",
          "expiryMonth": "1",
          "expiryYear": "2020",
          "startMonth": null,
          "startYear": null,
          "issueNumber": null,
          "email": "seckin@bumin.io",
          "birthday": "1971-11-11 15:12:24",
          "gender": null,
          "billingTitle": "Mr.",
          "billingFirstName": "SECKIN",
          "billingLastName": "SEN",
          "billingCompany": "BUMIN",
          "billingAddress1": "BUMN",
          "billingAddress2": null,
          "billingCity": "ANTALYA",
          "billingPostcode": "07070",
          "billingState": "ANTALYA",
          "billingCountry": "TR",
          "billingPhone": "05554443322",
          "billingFax": null,
          "shippingTitle": "Mr.",
          "shippingFirstName": "SECKIN",
          "shippingLastName": "SEN",
          "shippingCompany": "BUMIN",
          "shippingAddress1": "BUMN",
          "shippingAddress2": null,
          "shippingCity": "ANTALYA",
          "shippingPostcode": "07070",
          "shippingState": "ANTALYA",
          "shippingCountry": "TR",
          "shippingPhone": "05554443322",
          "shippingFax": null,
          "token": null
      }
  }
  );
});

app.get('*', async (req, res, next) => {
  try {
    const css = new Set();
      
    const fetch = (nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      fetch,
    });

    if (req.user && req.user.login) {
      store.dispatch(
        receiveLogin({
          access_token: req.cookies.access_token,
        }),
      );
    } else {
      store.dispatch(receiveLogout());
    }

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    const context = {
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      store,
      storeSubscription: null,
    };

    // eslint-disable-next-line no-underscore-dangle
    css.add(theme._getCss());

    const data = {
      title: 'Financial House Dashboard',
      description:
        'Financial House Dashboard Code Test',
    };
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js, assets.client.js];
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToString(
      <StaticRouter location={req.url} context={context}>
        <Provider store={store}>
          <App store={store} />
        </Provider>
      </StaticRouter>,
    );

    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    data.children = html;

    const markup = ReactDOM.renderToString(<Html {...data} />);

    res.status(200);
    res.send(`<!doctype html>${markup}`);
  } catch (err) {
    next(err);
  }
});

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res) => {
  // eslint-disable-line no-unused-vars
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

if (!module.hot) {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
}

if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./components/App.jsx');
}

export default app;



