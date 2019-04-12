/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Switch, Route, withRouter } from 'react-router';

// an example of react-router code-splitting
/* eslint-disable */
import loadNotFound from 'bundle-loader?lazy!../../pages/notFound';
import dashboard from 'bundle-loader?lazy!../../pages/dashboard';
import client from 'bundle-loader?lazy!../../pages/client'
import transactionDetail from 'bundle-loader?lazy!../../pages/transactionDetail'

/* eslint-enable */

import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
import Bundle from '../../core/Bundle';
import Sidebar from '../Sidebar';

// Dashboard component is loaded directly as an example of server side rendering

const NotFoundBundle = Bundle.generateBundle(loadNotFound);
const ClientBundle = Bundle.generateBundle(client);
const TransactionDetailBundle = Bundle.generateBundle(transactionDetail);
const DashboardBundle = Bundle.generateBundle(dashboard);

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: false,
    };
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar />
        <div
          className={cx(s.wrap, {[s.sidebarOpen]: this.state.sidebarOpen})}
        >
          <Header
            sidebarToggle={() =>
              this.setState({
                sidebarOpen: !this.state.sidebarOpen,
              })
            }
          />
          <main className={s.content}>
            <Switch>
              <Route path="/app/client/:transactionId" component={ClientBundle} />
              <Route path="/app/transaction/:transactionId" exact component={TransactionDetailBundle} />
              <Route path="/app/dashboard" exact component={DashboardBundle} />
              <Route component={NotFoundBundle} />
            </Switch>
          </main>
          <Footer />  
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(s)(Layout));
