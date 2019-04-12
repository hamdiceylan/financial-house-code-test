import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { getClients } from '../../actions/clients';
import { connect } from 'react-redux';
import {  
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem} from 'reactstrap';
import Widget from '../../components/Widget';
import s from './client.scss';

class Clients extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    clients: PropTypes.object, // eslint-disable-line
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    clients: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      clients: {},
    };
  }
  
  componentWillMount() {
    const transactionId = window.location.pathname.split('/')[3]; 
    this.props.dispatch(getClients(transactionId));
  }

  render() {
    return (
      <div className={s.root}>

        <Breadcrumb>
          <BreadcrumbItem active>Client Detail</BreadcrumbItem>
        </Breadcrumb>
        <Row>
          <Col sm={12} md={12}>
            <Widget
              title={
                <div>
                  <h3 className="mt-0 mb-3">
                  Client Details
                  </h3>
                </div>
              }
            >               <Row>
                {this.props.clients.customerInfo && (
                  <div className={s.categoryCard}>
                    <h5>Billing Title : {this.props.clients.customerInfo.billingTitle}</h5>
                    <h5>Billing First Name : {this.props.clients.customerInfo.billingFirstName}</h5>
                    <h5>Billing Last Name : {this.props.clients.customerInfo.billingLastName}</h5>
                    <h5>Billing City : {this.props.clients.customerInfo.billingCity}</h5>
                    <h5>Email : {this.props.clients.customerInfo.email}</h5>
                    <h5>Credit Card Number : {this.props.clients.customerInfo.number}</h5>
                    <h5>Expiry Year : {this.props.clients.customerInfo.expiryYear}</h5>
                    <h5>Expiry Month : {this.props.clients.customerInfo.expiryMonth}</h5>
                    <h5>Shipping Address : {this.props.clients.customerInfo.shippingAddress1}</h5>
                  </div>
                )}
            </Row>
            </Widget>       
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.clients.isFetching,
    clients: state.clients.clients,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Clients));


