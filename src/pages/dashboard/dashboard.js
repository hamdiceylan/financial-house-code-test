import React, {Component} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Table
} from 'reactstrap';

import { Link } from 'react-router-dom';



import Widget from '../../components/Widget';

import { fetchTransactions } from '../../actions/dashboard';
import s from './dashboard.scss';

class Dashboard extends Component {
  /* eslint-disable */
  static propTypes = {
    transactions: PropTypes.any,
    isFetching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };
  /* eslint-enable */

  static defaultProps = {
    transactions: [],
    isFetching: false,
  };

  state = {
    isDropdownOpened: false
  };

  componentWillMount() {
    this.props.dispatch(fetchTransactions());
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpened: !prevState.isDropdownOpened,
    }));
  }

  render() {
    return (
      <div className={s.root}>

        <Breadcrumb>
          <BreadcrumbItem active>Dashboard</BreadcrumbItem>
        </Breadcrumb>
        <Row>
          <Col>
            {this.props.isFetching && (
              <h1>Loading data please wait</h1>
            )}
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={12}>
            <Widget
              title={
                <div>
                   <h1 className="mb-lg">Transactions List</h1>
                </div>
              }
            >
            <div></div>
              <Table responsive borderless className={cx('mb-0', s.usersTable)}>
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Transection Id</th>
                    <th>Reference No</th>
                    <th>Message</th>
                    <th>Operation</th>
                    <th>Status</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.transactions &&
                      this.props.transactions.map((transaction,index) => (
                      <tr key={`transaction${index}`}>
                        <td><Link to={`/app/client/${transaction.transaction.merchant.transactionId}`}>{transaction.customerInfo.billingFirstName} {transaction.customerInfo.billingLastName}</Link></td>
                        <td><Link to={`/app/transaction/${transaction.transaction.merchant.transactionId}`}>{transaction.transaction.merchant.transactionId}</Link></td>
                        <td>{transaction.transaction.merchant.referenceNo}</td>
                        <td>{transaction.transaction.merchant.message}</td>
                        <td>{transaction.transaction.merchant.operation}</td>
                        <td>{transaction.transaction.merchant.status}</td>
                        <td>{transaction.transaction.merchant.type}</td>
                      </tr>
                  ))}
                </tbody>
              </Table>
            </Widget>
          </Col>        
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.transactions.isFetching,
    transactions: state.transactions.transactions,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Dashboard));