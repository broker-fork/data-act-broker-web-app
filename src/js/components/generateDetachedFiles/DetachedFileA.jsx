/**
 * DetachedFileA.jsx
 * Created by Lizzie Salita 11/5/18
 */

import React, { PropTypes } from 'react';
import Navbar from '../SharedComponents/navigation/NavigationComponent';
import Footer from '../SharedComponents/FooterComponent';
import AgencyListContainer from '../../containers/SharedContainers/AgencyListContainer';
import { defaultQuarters } from '../../helpers/quarterPickerHelper';

import * as Icons from '../SharedComponents/icons/Icons';
import QuarterPicker from "./QuarterPicker";
import GenerateButton from "./GenerateButton";

const initialQuarters = defaultQuarters();

const propTypes = {
    route: PropTypes.object,
    generateFileA: PropTypes.func,
    status: PropTypes.string
};

const defaultProps = {
    route: null,
    generateFileA: null,
    status: ''
};

export default class DetachedFileA extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            agency: '',
            codeType: 'cgac',
            agencyError: false,
            fy: `${initialQuarters.year}`,
            quarter: Math.max(...initialQuarters.quarters)
        };

        this.handleAgencyChange = this.handleAgencyChange.bind(this);
        this.pickedYear = this.pickedYear.bind(this);
        this.pickedQuarter = this.pickedQuarter.bind(this);
        this.generate = this.generate.bind(this);
    }

    handleAgencyChange(agency, codeType, isValid) {
        // display or hide file generation based on agency validity and set agency
        if (agency !== '' && isValid) {
            this.setState({
                agency,
                codeType,
                agencyError: false
            });
        }
        else {
            this.setState({
                agency: '',
                codeType: null,
                agencyError: true
            });
        }
    }

    pickedYear(fy) {
        this.setState({
            fy
        });
    }

    pickedQuarter(quarter) {
        this.setState({
            quarter
        });
    }

    generate() {
        this.props.generateFileA(this.state.agency, this.state.codeType, this.state.quarter, this.state.fy);
    }

    render() {
        let agencyIcon = <Icons.Building />;
        let agencyClass = '';
        if (this.props.agencyError) {
            agencyIcon = <Icons.Building />;
            agencyClass = ' error usa-da-form-icon';
        }

        return (
            <div className="usa-da-detached-file-a-page">
                <div className="usa-da-site_wrap">
                    <div className="usa-da-page-content">
                        <Navbar activeTab="submissionGuide" type={this.props.route.type} />
                        <div className="usa-da-content-dark">
                            <div className="container">
                                <div className="row usa-da-page-title">
                                    <div className="col-lg-12 mt-40 mb-20">
                                        <div className="display-2">Generate and Download File A</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container center-block">
                            <div className="row text-center usa-da-select-agency">
                                <div className="col-lg-offset-2 col-lg-8 mt-60 mb-60">
                                    <h5>Please begin by telling us about the files you would like to generate</h5>
                                    <div className="select-agency-holder">
                                        <div className="row usa-da-select-agency-label">
                                            The generated files will be used when submitting data for...
                                        </div>
                                        <div className="row">
                                            <div
                                                className="col-sm-12 col-md-12 typeahead-holder"
                                                data-testid="agencytypeahead">
                                                <AgencyListContainer
                                                    placeholder="Enter the name of the reporting agency"
                                                    onSelect={this.handleAgencyChange}
                                                    customClass={agencyClass} />
                                                <div className={"usa-da-icon usa-da-form-icon" + agencyClass}>
                                                    {agencyIcon}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description">
                                            <div className="description__content">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                                                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </div>
                                        </div>
                                        <div className="file-a-section">
                                            <div className="file-a-section__label">
                                                File A: Appropriations Accounts
                                            </div>
                                            <div className="file-a-section__date">
                                                <QuarterPicker
                                                    pickedYear={this.pickedYear}
                                                    pickedQuarter={this.pickedQuarter}
                                                    fy={this.state.fy}
                                                    quarter={this.state.quarter} />
                                            </div>
                                        </div>
                                        <GenerateButton
                                            agency={this.state.agency}
                                            generate={this.generate}
                                            status={this.props.status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

DetachedFileA.propTypes = propTypes;
DetachedFileA.defaultProps = defaultProps;
