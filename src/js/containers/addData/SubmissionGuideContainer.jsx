/**
 * SubmissionGuideContainer.jsx
 * Created by Mike Bray 5/23/16
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SubmissionGuidePage from 'components/addData/SubmissionGuidePage';
import * as sessionActions from 'redux/actions/sessionActions';
import { setSkipGuide } from 'helpers/submissionGuideHelper';
import { Redirect } from 'react-router-dom';

const propTypes = {
    setSkipGuide: PropTypes.func,
    location: PropTypes.object,
    session: PropTypes.object
};

const defaultProps = {
    setSkipGuide: () => {},
    location: {},
    session: {}
};

class SubmissionGuideContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goToAddData: false
        };

        this.saveSkipGuide = this.saveSkipGuide.bind(this);
    }
    componentDidMount() {
        const forceDisplay = (Object.prototype.hasOwnProperty.call(this.props.location.query, 'force') &&
            this.props.location.query.force === 'true');

        if (this.props.session.skipGuide && !forceDisplay) {
            this.sendToAddData();
        }
    }

    saveSkipGuide(skipGuide) {
        setSkipGuide(skipGuide)
            .then(() => {
                // update the Redux state
                this.props.setSkipGuide(skipGuide);
                this.sendToAddData();
            })
            .catch((err) => {
                // TODO: Figure out how to handle errors
                console.error(err);
            });
    }

    sendToAddData() {
        this.setState({
            goToAddData: true
        });
    }

    render() {
        if (this.state.goToAddData) {
            return <Redirect to="/addData/" />;
        }
        return (
            <SubmissionGuidePage {...this.props} saveSkipGuide={this.saveSkipGuide} />
        );
    }
}

SubmissionGuideContainer.propTypes = propTypes;
SubmissionGuideContainer.defaultProps = defaultProps;

export default connect(
    (state) => ({ session: state.session }),
    (dispatch) => bindActionCreators(sessionActions, dispatch)
)(SubmissionGuideContainer);
