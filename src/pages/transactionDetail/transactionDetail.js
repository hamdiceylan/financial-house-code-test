import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { getTransactionDetail } from '../../actions/transactionDetail';
import { connect } from 'react-redux';
import {  
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem} from 'reactstrap';
import Widget from '../../components/Widget';
import s from './transactionDetail.scss';

class TransactionDetail extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    transactionDetail: PropTypes.object, // eslint-disable-line
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    transactionDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      transactionDetail: {},
    };
  }
  
  componentWillMount() {
    const transactionId = window.location.pathname.split('/')[3]; 
    this.props.dispatch(getTransactionDetail(transactionId));
  }

  render() {
    return (
      <div className={s.root}>
       <Breadcrumb>
          <BreadcrumbItem active>Transaction Detail</BreadcrumbItem>
        </Breadcrumb>
        <Row>
          <Col sm={12} md={12}>
            <Widget
                title={
                  <div>
                    <h3 className="mt-0 mb-3">
                      Fx Details
                    </h3>
                  </div>
                }
              >
              <Row>
                  {this.props.transactionDetail.fx && (
                    <div className={s.categoryCard}>
                      <h5>Original Amount : {this.props.transactionDetail.fx.merchant.originalAmount}</h5>
                      <h5>Original Currency : {this.props.transactionDetail.fx.merchant.originalCurrency}</h5>
                    </div>
                  )}
              </Row>
              </Widget>   
            <Widget
                title={
                  <div>
                    <h3 className="mt-0 mb-3">
                    Transaction Details
                    </h3>
                  </div>
                }
              >   
                <Row>
                    {this.props.transactionDetail.transaction && (
                      <div className={s.categoryCard}>
                        <h5>Id : {this.props.transactionDetail.transaction.merchant.id}</h5>
                        <h5>Chain Id : {this.props.transactionDetail.transaction.merchant.chainId}</h5>
                        <h5>Message : {this.props.transactionDetail.transaction.merchant.message}</h5>
                        <h5>Operation : {this.props.transactionDetail.transaction.merchant.operation}</h5>
                        <h5>Channel : {this.props.transactionDetail.transaction.merchant.channel}</h5>
                      </div>
                    )}
                </Row>
              </Widget> 
            <Widget
              title={
                <div>
                  <h3 className="mt-0 mb-3">
                  Customer Details
                  </h3>
                </div>
              }
            >   
              <Row>
                  {this.props.transactionDetail.customerInfo && (
                    <div className={s.categoryCard}>
                      <h5>Title : {this.props.transactionDetail.customerInfo.billingTitle}</h5>
                      <h5>First Name : {this.props.transactionDetail.customerInfo.billingFirstName}</h5>
                      <h5>Last Name : {this.props.transactionDetail.customerInfo.billingLastName}</h5>
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
    isFetching: state.transactionDetail.isFetching,
    transactionDetail: state.transactionDetail.transactionDetail,
  };
}

export default connect(mapStateToProps)(withStyles(s)(TransactionDetail));


