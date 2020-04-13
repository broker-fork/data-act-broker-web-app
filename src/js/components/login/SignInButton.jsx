/**
* SignInButton.jsx
* Created by Kyle Fox 2/19/16
*
* This button needs to be given a function to run when it is clicked.
* Pass this function through props, calling it onClick
*/

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    buttonText: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

const defaultProps = {
    disabled: false
};

export default class SignInButton extends React.Component {
    render() {
        let disabled = '';
        if (this.props.disabled) {
            disabled = ' usa-da-btn-disabled';
        }
        return (
            <button
                className={`usa-da-button btn-primary btn-lg pull-right${disabled}`}
                disabled={this.props.disabled}
                type="submit"
                data-testid="signin">
                {this.props.buttonText}
            </button>
        );
    }
}

SignInButton.propTypes = propTypes;
SignInButton.defaultProps = defaultProps;
