/**
  * SubmissionsTablePaginatorItem.jsx
  * Created by Kevin Li 10/31/16
  */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    changePage: PropTypes.func,
    value: PropTypes.number,
    current: PropTypes.bool,
    showLead: PropTypes.bool,
    showTail: PropTypes.bool
};

const defaultProps = {
    changePage: null,
    current: false,
    value: 1,
    showLead: false,
    showTail: false
};

export default class SubmissionsTablePaginatorItem extends React.Component {
    clickedPage(e) {
        e.preventDefault();
        this.props.changePage(this.props.value);
    }

    render() {
        let className = '';
        if (this.props.current) {
            className = 'active';
        }

        let start = null;
        let end = null;

        if (this.props.showLead) {
            start = ' ... ';
        }

        if (this.props.showTail) {
            end = ' ... ';
        }

        return (
            <li className={className}>
                {start}
                <button onClick={this.clickedPage.bind(this)} title={`Go to page ${this.props.value}`}>
                    {this.props.value}
                </button>
                {end}
            </li>
        );
    }
}

SubmissionsTablePaginatorItem.propTypes = propTypes;
SubmissionsTablePaginatorItem.defaultProps = defaultProps;