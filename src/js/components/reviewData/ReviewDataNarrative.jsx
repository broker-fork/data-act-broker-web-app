/**
 * ReviewDataNarrative.jsx
 * Created by Alisa Burdeyny 11/21/16
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReviewDataNarrativeDropdown from './ReviewDataNarrativeDropdown';
import ReviewDataNarrativeTextfield from './ReviewDataNarrativeTextfield';
import { createOnKeyDownHandler } from '../../helpers/util';
import * as Icons from '../SharedComponents/icons/Icons';

import * as ReviewHelper from '../../helpers/reviewHelper';

const propTypes = {
    submissionID: PropTypes.string
};

const defaultProps = {
    submissionID: ''
};

export default class ReviewDataNarrative extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentFile: "A",
            fileNarrative: {},
            currentNarrative: "",
            saveState: "",
            errorMessage: false
        };
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateState(props);
    }

    getNewNarrative() {
        const tempNarrative = this.state.fileNarrative;
        tempNarrative[this.state.currentFile] = this.state.currentNarrative;
        return tempNarrative;
    }

    saveNarrative() {
        this.setState({ saveState: "Saving" });
        const tempNarrative = this.getNewNarrative();

        ReviewHelper.saveNarrative(this.props.submissionID, tempNarrative)
            .then(() => {
                this.setState({
                    saveState: "Saved",
                    errorMessage: ""
                });
            })
            .catch(() => {
                this.setState({
                    saveState: "Error",
                    errorMessage: ""
                });
            });
    }

    downloadCommentsFile() {
        ReviewHelper.fetchCommentsFile(this.props.submissionID)
            .then((result) => {
                window.open(result.url);
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    saveState: "Error",
                    errorMessage: `: ${error.message}`
                });
            });
    }

    updateState(props) {
        this.setState({
            currentFile: "A",
            fileNarrative: props.narrative,
            currentNarrative: props.narrative.A,
            saveState: ""
        });
    }

    changeFile(newFile) {
        const tempNarrative = this.getNewNarrative();

        this.setState({
            fileNarrative: tempNarrative,
            currentFile: newFile,
            currentNarrative: tempNarrative[newFile]
        });
    }

    textChanged(newNarrative) {
        this.setState({ currentNarrative: newNarrative });
    }

    render() {
        const onKeyDownHandler = createOnKeyDownHandler(this.downloadCommentsFile.bind(this));
        return (
            <div className="narrative-wrapper col-md-8">
                <div className="gray-bg">
                    <h4>Add comments to files</h4>
                    <div className="row">
                        <div className="col-md-7">
                            <ReviewDataNarrativeDropdown changeFile={this.changeFile.bind(this)} />
                        </div>
                        <div className="col-md-5 pull-right">
                            <div
                                role="button"
                                tabIndex={0}
                                className="usa-da-download pull-right"
                                onKeyDown={onKeyDownHandler}
                                onClick={this.downloadCommentsFile.bind(this)}>
                                <span className="usa-da-icon usa-da-download-report">
                                    <Icons.CloudDownload />
                                </span>Download Comments for All Files (.csv)
                            </div>
                        </div>
                    </div>
                    <ReviewDataNarrativeTextfield
                        currentContent={this.state.currentNarrative}
                        textChanged={this.textChanged.bind(this)} />
                    <div className="row">
                        <div className="col-md-12">
                            <button onClick={this.saveNarrative.bind(this)} className="usa-da-button btn-default">
                                Save Changes
                            </button>
                            <p className={`save-state ${this.state.saveState}`}>
                                {this.state.saveState}{this.state.errorMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReviewDataNarrative.propTypes = propTypes;
ReviewDataNarrative.defaultProps = defaultProps;
