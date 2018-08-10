/**
  * LandingRequirementsBody.jsx
  * Created by Minahm Kim 7/17/17
  */

import React, { PropTypes } from 'react';
import Moment from 'moment';
import { generateProtectedUrls } from '../../../helpers/util';

const propTypes = {
    window: PropTypes.array,
    type: PropTypes.string
};

const defaultProps = {
    window: [],
    type: ''
};

export default class LandingRequirementsBody extends React.Component {
    constructor(props) {
        super(props);

        this.urlPromise = null;

        this.state = {
            validationRulesUrl: '#'
        };
    }

    componentDidMount() {
        // load the validation rules URL
        this.urlPromise = generateProtectedUrls();
        this.urlPromise.promise
            .then((urls) => {
                this.setState({
                    validationRulesUrl: urls['DAIMS_Validation_Rules_v1.2.1.xlsx'],
                    fabsSampleFileUrl: urls['DAIMS_FABS_Sample_Submission_File_v1.2.csv']
                });

                this.urlPromise = null;
            });
    }

    componentWillUnmount() {
        // cancel in-flight S3 signing requests when the component unmounts
        if (this.urlPromise) {
            this.urlPromise.cancel();
        }
    }

    windowBlocked() {
        if (!this.props.window) {
            return false;
        }
        for (let i = 0; i < this.props.window.length; i++) {
            if (this.props.window[i].notice_block) {
                return this.props.window[i];
            }
        }
        return false;
    }

    render() {
        const awsS3 = "https://s3-us-gov-west-1.amazonaws.com/prod-data-act-web-static-files/";
        let windowWarning = null;
        const windowBlock = this.windowBlocked();
        if (windowBlock) {
            windowWarning = (
                <strong>
                    {"Note: You cannot certify until " + Moment(windowBlock.end_date).format("dddd, MMMM D, YYYY")}
                </strong>);
        }

        const resources = this.props.type === 'fabs' ? '#/FABSResources' : '#/resources';
        let header = "You'll need the following files in order to complete your submission";
        let body = (
            <div>
                <ul>
                    <li>
                        File A: Appropriation Account data
                    </li>
                    <li>
                        File B: Object Class and Program Activity data
                    </li>
                    <li>
                        File C: Award Financial data
                    </li>
                </ul>

                <p className="mt-30">
                    <strong>
                        Files D1, D2, E, and F will be generated for you based on the reporting period you provide.
                    </strong>
                </p>

                <ul>
                    <li>
                        File D1: Procurement Awards data (Award and Awardee Attributes)
                    </li>
                    <li>
                        File D2: Financial Assistance data (Award and Awardee Attributes)
                    </li>
                    <li>
                        File E: Additional Awardee Attributes data
                    </li>
                    <li>
                        File F: Sub-award Attributes data
                    </li>
                </ul>
                <p>Submission information is available on the DAIMS page of the Data Transparency site for the Bureau of the Fiscal Service. </p>
            </div>);

        if (this.props.type === 'fabs') {
            header = "You'll need the following files in order to complete your FABS submission";
            body = (
                <div>
                    <ul>
                        <li>
                            FABS File: Financial Assistance data
                        </li>
                    </ul>
                    <p>
                        Submission information is available on the <a target="_blank" rel="noopener noreferrer" href="https://fiscal.treasury.gov/fsservices/gov/data-trans/dt-daims.htm">DAIMS</a> page of the Data Transparency site for the Bureau of the Fiscal Service.
                    </p>
                </div>);
        }

        return (
            <div className="usa-da-landing-modal-content">
                <h4>{header}</h4>
                {body}
                {windowWarning}
            </div>
        );
    }
}

LandingRequirementsBody.propTypes = propTypes;
LandingRequirementsBody.defaultProps = defaultProps;
