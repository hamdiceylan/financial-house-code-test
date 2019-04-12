import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Footer.scss';

class Footer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    return (
      <footer className={cx(s.root, this.props.className)}>
        <div className={s.container}>
          <span>© 2019 &nbsp;Financial House </span>
        </div>
      </footer>
    );
  }
}

export default withStyles(s)(Footer);
