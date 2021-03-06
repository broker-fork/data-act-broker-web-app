/**
  * CertifyButtons.jsx
  * Created by Kevin Li 9/7/16
  */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    clickedCertifyButton: PropTypes.func,
    clickedCertifyCheckbox: PropTypes.func,
    closeModal: PropTypes.func,
    session: PropTypes.object,
    certified: PropTypes.bool,
    loading: PropTypes.bool
};

const defaultProps = {
    clickedCertifyButton: null,
    clickedCertifyCheckbox: null,
    closeModal: null,
    session: {},
    certified: false
};

export default class CertifyButtons extends React.Component {
    render() {
        let certifyButtonText = "Publish to USAspending.gov";
        let buttonClass = "";
        if (!this.props.certified) {
            buttonClass = " btn-disabled";
        }
        if (this.props.loading) {
            certifyButtonText = "Certifying";
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-12 certify-check">
                        <input
                            type="checkbox"
                            id="certify-check"
                            checked={this.props.certified}
                            onChange={this.props.clickedCertifyCheckbox} />
                        <label htmlFor="certify-check">
                            I <b>({this.props.session.user.name.toUpperCase()})</b> certify that the data in this
                            submission meets the criteria above.
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-10">
                        <button
                            onClick={this.props.clickedCertifyButton}
                            className={`usa-da-button btn-full btn-primary${buttonClass}`}
                            disabled={!this.props.certified || this.props.loading}>
                            {certifyButtonText}
                        </button>
                    </div>
                    <div className="col-md-6 mb-10">
                        <button onClick={this.props.closeModal} className="usa-da-button btn-full decline-button">
                            Don&apos;t Publish to USAspending.gov
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

CertifyButtons.propTypes = propTypes;
CertifyButtons.defaultProps = defaultProps;
