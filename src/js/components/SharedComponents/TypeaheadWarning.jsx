/**
  * TypeaheadWarning.jsx
  * Created by Kevin Li 7/14/16
  */

import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from './icons/Icons';

const propTypes = {
    description: PropTypes.string,
    header: PropTypes.string
};

const defaultProps = {
    header: 'Unknown Agency',
    description: 'You must select an agency from the list that is provided as you type.'
};

export default class TypeaheadWarning extends React.Component {
    render() {
        return (
            <div className="typeahead-warning alert alert-error text-left" role="alert">
                <span className="usa-da-icon error-icon"><Icons.ExclamationCircle /></span>
                <div className="alert-header-text">{this.props.header}</div>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

TypeaheadWarning.propTypes = propTypes;
TypeaheadWarning.defaultProps = defaultProps;
