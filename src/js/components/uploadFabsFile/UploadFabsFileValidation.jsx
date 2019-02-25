/**
* UploadFabsFileValidation.jsx
* Created by Minahm Kim
*/
/* eslint-disable */
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import React, { PropTypes } from "react";
import { connect } from "react-redux";

import ValidateValuesFileContainer from "../../containers/validateData/ValidateValuesFileContainer";
import ValidateDataFileContainer from "../../containers/validateData/ValidateDataFileContainer";
import PublishModal from "./PublishModal";
import Banner from "../SharedComponents/Banner";
import UploadFabsFileError from "./UploadFabsFileError";
import UploadFabsFileHeader from "./UploadFabsFileHeader";

import * as UploadHelper from "../../helpers/uploadHelper";
import * as GenerateFilesHelper from "../../helpers/generateFilesHelper";
import * as PermissionsHelper from "../../helpers/permissionsHelper";
import * as ReviewHelper from "../../helpers/reviewHelper";
import { kGlobalConstants } from "../../GlobalConstants";

import * as Icons from '../SharedComponents/icons/Icons';

const propTypes = {
    setSubmissionState: PropTypes.func,
    item: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
    session: PropTypes.object,
    submission: PropTypes.object
};

const defaultProps = {
    setSubmissionState: () => {},
    item: {},
    params: {},
    route: {},
    session: {},
    submission: {}
};

const timerDuration = 5;

class UploadFabsFileValidation extends React.Component {
    constructor(props) {
        super(props);

        this.isUnmounted = false;

        this.state = {
            agency: "",
            submissionID: this.props.params.submissionID ? this.props.params.submissionID : 0,
            fabsFile: {},
            cgac_code: "",
            jobResults: { fabs: {} },
            headerErrors: false,
            validationFinished: false,
            error: 0,
            published: "unpublished",
            submit: true,
            showPublish: false,
            type: this.props.route.type,
            showSuccess: false,
            error_message: "",
            fabs_meta: { valid_rows: 0, total_rows: 0, publish_date: null },
            metadata: {},
            signedUrl: "",
            signInProgress: false
        };
    }

    componentDidMount() {
        this.isUnmounted = false;
        if (this.state.submissionID) {
            this.setSubmissionMetadata(this.state.submissionID);
            this.checkFileStatus(this.state.submissionID);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.submissionID !== this.state.submissionID) {
            this.setState({
                submissionID: nextProps.params.submissionID
            });
            this.setSubmissionMetadata(nextProps.params.submissionID);
            this.checkFileStatus(nextProps.params.submissionID);
        }
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    setSubmissionMetadata(submissionID) {
        ReviewHelper.fetchSubmissionMetadata(submissionID)
            .then((response) => {
                this.setState({
                    metadata: response,
                    agency: response.agency_name,
                    cgac_code: response.cgac_code,
                    published: response.publish_status,
                    fabs_meta: response.fabs_meta
                });
            })
            .catch((error) => {
                // Invalid Submission ID
                if (error.httpStatus === 400) {
                    console.log("errMsgElse");
                    const errMsg = "This is not a valid submission. Check your validation URL and try again.";
                    this.setState({
                        published: 'unpublished',
                        error: 4,
                        error_message: errMsg
                    });
                }
            });
    }

    openModal() {
        this.setState({
            showPublish: true
        });
    }

    closeModal() {
        this.setState({
            showPublish: false
        });
    }

    startRevalidation() {
        this.setState({
            validationFinished: false,
            published: 'unpublished'
        }, this.revalidate());
    }

    revalidate() {
        ReviewHelper.revalidateSubmission(this.state.submissionID, true)
            .then(() => {
                this.checkFileStatus(this.state.submissionID);
            })
            .catch((error) => {
                const errMsg = error.message || "An error occurred while attempting to revalidate the submission. " +
                    "Please contact the Service Desk.";

                this.setState({
                    error: 4,
                    error_message: errMsg
                });
            });
    }

    checkFileStatus(submissionID) {
        // callback to check file status

        console.log("checkFileStatus1")
        ReviewHelper.fetchStatus(submissionID)
            .then((response) => {

                console.log("checkFileStatus2")
                if (this.isUnmounted) {
                    console.log("unmounted")
                    return;
                }

                console.log("checkFileStatusThen");
                const fabsData = response.fabs;
                if (fabsData.status !== 'uploading' && fabsData.status !== 'running') {
                    let success = false;
                    if (this.dataTimer) {
                        window.clearInterval(this.dataTimer);
                        this.dataTimer = null;
                        success = true;
                    }

                    ReviewHelper.fetchSubmissionMetadata(submissionID)
                        .then((metadataResponse) => {
                            ReviewHelper.fetchSubmissionData(submissionID)
                                .then((dataResponse) => {
                                    const fabsJob = ReviewHelper.getFileStates(dataResponse).fabs;
                                    this.setState({
                                        jobResults: { fabs: fabsJob },
                                        error: 0,
                                        showSuccess: success,
                                        published: metadataResponse.publish_status,
                                        fabs_meta: metadataResponse.fabs_meta,
                                        validationFinished: true,
                                        headerErrors: fabsJob.error_type === 'header_errors'
                                    });
                                });
                        });
                }
                else if (!this.dataTimer) {
                    window.setTimeout(() => {
                        if (submissionID) {
                            this.checkFileStatus(submissionID);
                        }
                    }, timerDuration * 1000);
                }
            })
            .catch((err) => {
                if (err.status === 400) {
                    console.log("checkFileStatusCatch");
                    this.setState({ error: 2, submit: false });
                }
            });

        console.log("checkfilestatusOut");
    }

    checkFile(submissionID) {
        this.dataTimer = window.setInterval(() => {
            if (this.state.published !== "published") {
                this.checkFileStatus(submissionID);
            }
        }, timerDuration * 1000);
    }

    signReport(item) {
        GenerateFilesHelper.getFabsMeta(this.props.submission.id)
            .then((result) => {
                this.setState({
                    signedUrl: result.published_file,
                    signInProgress: false
                }, () => {
                    this.openReport();
                });
            })
            .catch(() => {
                this.setState({
                    error: 1,
                    error_message: `Invalid File Type Selected ${item.file_type}`,
                    signInProgress: false
                });
            });
    }

    openReport() {
        window.open(this.state.signedUrl);
    }

    clickedReport(item) {
        // check if the link is already signed
        if (this.state.signInProgress) {
            // sign is in progress, do nothing

        }
        else if (this.state.signedUrl !== "") {
            // it is signed, open immediately
            this.openReport();
        }
        else {
            // not signed yet, sign
            this.setState({
                signInProgress: true
            }, () => {
                this.signReport(item);
            });
        }
    }

    submitFabs() {
        this.setState({ submit: false, published: 'publishing', showPublish: false },
            () => {
                UploadHelper.submitFabs({ submission_id: this.props.submission.id })
                    .then(() => {
                        this.checkFile(this.props.submission.id);
                    })
                    .catch((error) => {
                        if (error.httpStatus === 400) {
                            this.setState({ error: 1, error_message: error.message, published: 'unpublished' });
                        }
                        else if (error.httpStatus === 500) {
                            this.setState({ error: 4, error_message: error.message, published: 'unpublished' });
                        }
                        else {
                            this.setState({ error: 1, error_message: error.message, published: 'unpublished' });
                        }
                    });
            }
        );
    }

    // ERRORS
    // 1: Submission is already published
    // 2: Fetching file metadata failed
    // 3: File already has been submitted in another submission
    // 4: Submission ID does not exist

    uploadFileHelper(local, submission) {
        if (local) {
            return UploadHelper.performFabsLocalCorrectedUpload(submission);
        }
        return UploadHelper.performFabsFileCorrectedUpload(submission);
    }

    uploadFile(item) {
        if (this.isUnmounted) {
            return;
        }

        // upload specified file
        this.props.setSubmissionState("uploading");
        const submission = this.props.submission;
        submission.files.fabs = {};
        submission.files.fabs.file = item;

        // reset file and job status
        const currentResults = this.state.jobResults;
        currentResults.fabs.file_status = "";
        currentResults.fabs.job_status = "";
        this.setState({
            jobResults: currentResults
        });

        this.uploadFileHelper(kGlobalConstants.LOCAL, submission)
            .then((submissionID) => {
                this.setState({
                    validationFinished: false
                });
                setTimeout(() => {
                    this.checkFileStatus(submissionID);
                }, 2000);
            })
            .catch((err) => {
                this.setState({
                    validationFinished: false,
                    notAllowed: err.httpStatus === 403,
                    errorMessage: err.httpStatus === 403 ? err.message : err.body.message
                });
            });
    }

    render() {
        console.log("rendering");
        let validationButton = null;
        let revalidateButton = null;
        let downloadButton = null;
        let validationBox = null;

        const type = {
            fileTitle: "Upload",
            requestName: "fabs",
            progress: "0"
        };

        const fileData = this.state.jobResults[type.requestName];
        const status = fileData.job_status;
        let errorMessage = null;
        if(this.state.error === 0 || this.state.published === "publishing" || this.state.validationFinished) {
            validationBox = (<ValidateDataFileContainer
                type={type}
                data={this.state.jobResults}
                setUploadItem={this.uploadFile.bind(this)}
                updateItem={this.uploadFile.bind(this)}
                publishing={this.state.published === "publishing"}
                agencyName={this.state.agency}/>);
        }
        if (fileData.file_status === "complete" && this.state.validationFinished &&
            this.state.published !== "publishing") {
            console.log("passed into fileData");
            if (status !== "invalid" || fileData.file_status === "complete") {
                validationBox = (<ValidateValuesFileContainer
                    type={type}
                    data={this.state.jobResults}
                    setUploadItem={this.uploadFile.bind(this)}
                    updateItem={this.uploadFile.bind(this)}
                    published={this.state.published}
                    agencyName={this.state.agency} />);
            }

            if (this.state.showSuccess) {
                errorMessage = (<UploadFabsFileError
                    errorCode={this.state.error}
                    type="success"
                    message={this.state.error_message} />);
            }
            if (this.state.published === "published") {
                // This submission is already published and cannot be republished
                const parsedDate = this.state.fabs_meta.publish_date.split(' ');
                if (this.state.fabs_meta.published_file === null) {
                    validationButton = (
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-8 button-text-container text-right">
                                    <Icons.CheckCircle />
                                    File Published: {this.state.fabs_meta.valid_rows}&nbsp;
                                    row(s) of data (excluding header) published at &nbsp;
                                    {parsedDate[0]} on {parsedDate[1]}
                                    <span className="tooltip-popover-container">
                                        <Icons.InfoCircle />
                                        <span className="tooltip-popover above">
                                            <span>
                                                The published file differs from the submitted file in four ways:
                                            </span>
                                            <span>1) It contains derivations based on agency data, as described
                                        in the DAIMS Practices and Procedures document;
                                            </span>

                                            <span>2) Any rows in the submitted file with unresolved critical
                                        errors will not be published.
                                            </span>

                                            <span>3) Its order matches the header order in DAIMS-IDD-D2,
                                        rather than that in the submitted file.
                                            </span>

                                            <span>4) Any extraneous headers, Flex or otherwise, are not carried
                                         over to the published file.
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <button
                                    className="pull-right col-xs-3 us-da-disabled-button"
                                    disabled> Download Published File
                                </button>
                            </div>
                        </div>
                    );
                }
                else {
                    console.log("elsed");
                    downloadButton = (
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-8 button-text-container text-right">
                                    <Icons.CheckCircle />
                                    File Published: {this.state.fabs_meta.valid_rows}&nbsp;
                                    row(s) of data (excluding header) published at &nbsp;
                                    {parsedDate[0]} on {parsedDate[1]}
                                    <span className="tooltip-popover-container">
                                        <Icons.InfoCircle />
                                        <span className="tooltip-popover above">
                                            <span>The published file differs from the submitted file in four ways: </span>
                                            <span>1) It contains derivations based on agency data, as described
                                        in the DAIMS Practices and Procedures document;
                                            </span>

                                            <span>2) Any rows in the submitted file with unresolved critical
                                        errors will not be published.
                                            </span>

                                            <span>3) Its order matches the header order in DAIMS-IDD-D2,
                                        rather than that in the submitted file.
                                            </span>

                                            <span>4) Any extraneous headers, Flex or otherwise, are not carried
                                         over to the published file.
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <button
                                    className="pull-right col-xs-3 us-da-button"
                                    onClick={this.clickedReport.bind(this, this.props.item)}
                                    download={this.state.fabs_meta.published_file}
                                    rel="noopener noreferrer"> Download Published File
                                </button>
                            </div>
                        </div>);
                }
            }
            else if (PermissionsHelper.checkFabsPermissions(this.props.session)) {
                // User has permissions to publish this unpublished submission
                validationButton = (
                    <button
                        className="pull-right col-xs-3 us-da-button"
                        onClick={this.openModal.bind(this)}>
                        Publish
                    </button>);
                revalidateButton = (
                    <button
                        className="pull-right col-xs-3 us-da-button revalidate-button"
                        onClick={this.startRevalidation.bind(this)}>
                        Revalidate
                    </button>);
            }
            else {
                // User does not have permissions to publish
                validationButton = (
                    <button
                        className="pull-right col-xs-3 us-da-disabled-button"
                        disabled>
                        You do not have permissions to publish
                    </button>);
            }
        }

        if (this.state.published === "publishing" && this.state.error !== 0) {
            console.log("marked as publishing");
            errorMessage = (<UploadFabsFileError
                errorCode={this.state.error}
                type="error"
                message={this.state.error_message} />);
            validationButton = null;
            revalidateButton = (
                <button
                    className="pull-right col-xs-3 us-da-button"
                    onClick={this.startRevalidation.bind(this)}>
                    Revalidate
                </button>);
        }
        else if (this.state.published === "unpublished" && this.state.error !== 0) {
            console.log("unpublished elif");
            errorMessage = (<UploadFabsFileError
                errorCode={this.state.error}
                type="error"
                message={this.state.error_message} />);
            validationBox = null;
            validationButton = null;
            revalidateButton = null;
        }

        return (
            <div>
                <UploadFabsFileHeader details={this.state.metadata} />
                <Banner type="fabs" />
                <div className="container">
                    <div className="col-xs-12 mt-60 mb-60">
                        <div className="validation-holder">

                            <ReactCSSTransitionGroup
                                transitionName="usa-da-meta-fade"
                                transitionEnterTimeout={600}
                                transitionLeaveTimeout={200}>
                                {validationBox}
                            </ReactCSSTransitionGroup>

                            {errorMessage}

                            <ReactCSSTransitionGroup
                                transitionName="usa-da-meta-fade"
                                transitionEnterTimeout={600}
                                transitionLeaveTimeout={200}>
                                {validationButton}
                                {revalidateButton}
                                {downloadButton}
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                </div>
                <PublishModal
                    rows={this.state.fabs_meta}
                    submit={this.submitFabs.bind(this)}
                    submissionID={this.state.submissionID}
                    closeModal={this.closeModal.bind(this)}
                    isOpen={this.state.showPublish}
                    published={this.state.published} />
            </div>
        );
    }
}

UploadFabsFileValidation.propTypes = propTypes;
UploadFabsFileValidation.defaultProps = defaultProps;

export default connect(
    (state) => ({ session: state.session })
)(UploadFabsFileValidation);
