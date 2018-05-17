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
                <p>
                    You may download and use the following sample data files if you don't have the required files on
                    hand. The sample files can be downloaded below.
                </p>

                <ul>
                    <li>
                        File A: Appropriation Account data (
                        <a
                            href={awsS3 + "sample-files/appropValid.csv"}
                            target="_blank"
                            rel="noopener noreferrer">
                            Download sample file
                        </a>
                        )
                    </li>
                    <li>
                        File B: Object Class and Program Activity data (
                        <a
                            href={awsS3 + "sample-files/programActivityValid.csv"}
                            target="_blank"
                            rel="noopener noreferrer">
                            Download sample file
                        </a>)
                    </li>
                    <li>
                        File C: Award Financial data (
                        <a
                            href={awsS3 + "sample-files/awardFinancialValid.csv"}
                            target="_blank"
                            rel="noopener noreferrer">
                            Download sample file
                        </a>
                        )
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
            </div>);

        if (this.props.type === 'fabs') {
            header = "You'll need the following files in order to complete your FABS submission";
            body = (
                <div>
                    <p>
                        You may download and use the following sample file to help prepare your submission if you don’t
                        have any previous submission files on hand
                    </p>
                    <ul>
                        <li>
                            <a
                                href={this.state.fabsSampleFileUrl}
                                target="_blank"
                                rel="noopener noreferrer">
                                DAIMS_FABS_Sample_Submission_File_v1.2.csv
                            </a>
                        </li>
                    </ul>
                    <p>
                        Here are some additional resources to assist you with your submission:
                    </p>
                    <ul>
                        <li>
                            <a
                                href={this.state.validationRulesUrl}
                                target="_blank"
                                rel="noopener noreferrer">
                                DAIMS Validation Rules v1.2.1
                            </a>
                        </li>
                        <li>
                            <a
                                href={"https://github.com/fedspendingtransparency/data-act-broker-backend/blob/" +
                                "master/dataactvalidator/config/sqlrules/sqlRules.csv"}
                                target="_blank"
                                rel="noopener noreferrer">
                                Error Codes and Messages
                            </a>
                        </li>
                        <li>
                            <a href={resources} target="_blank" rel="noopener noreferrer">
                                DATA Act Information Model Schema (DAIMS)
                            </a>
                            resources related to FABS. See:
                            <ul>
                                <li>
                                    <a
                                        href={"https://community.max.gov/download/attachments/1324878095/" +
                                        "DAIMS_Practices_Procedures_v1.2.pdf"}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        DAIMS Practices &amp; Procedures v1.2
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="http://fedspendingtransparency.github.io/assets/docs/DAIMS_RSS_v1.2.xlsx"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        DAIMS RSS v1.2 (FABS tab)
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
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
