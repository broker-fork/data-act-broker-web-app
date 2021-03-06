/**
 * ReviewDataNarrativeTextfield.jsx
 * Created by Alisa Burdeyny 11/21/16
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    textChanged: PropTypes.func,
    currentContent: PropTypes.string
};

const defaultProps = {
    textChanged: null,
    currentContent: ''
};

export default class ReviewDataNarrativeTextfield extends React.Component {
    textChanged(e) {
        this.props.textChanged(e.target.value);
    }

    render() {
        return (
            <div className="narrative-box">
                <textarea
                    id="submission-review-narrative"
                    value={this.props.currentContent}
                    onChange={this.textChanged.bind(this)} />
            </div>
        );
    }
}

ReviewDataNarrativeTextfield.propTypes = propTypes;
ReviewDataNarrativeTextfield.defaultProps = defaultProps;
