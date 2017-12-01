/**
* NavigationComponent.jsx
* Created by Katie Rose 12/8/15
*/

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { kGlobalConstants } from '../../../GlobalConstants';
import NavbarTab from './NavbarTab';
import UserButton from './UserButton';
import SkipNavigationLink from './SkipNavigationLink';
import TestEnvironmentBanner from '../banners/TestEnvironmentBanner';
import * as sessionActions from '../../../redux/actions/sessionActions';
import * as PermissionHelper from '../../../helpers/permissionsHelper';
import * as Icons from '../icons/Icons';

const propTypes = {
    setSession: PropTypes.func,
    session: PropTypes.object,
    type: PropTypes.string,
    logoOnly: PropTypes.bool
};

const defaultProps = {
    setSession: () => {},
    session: null,
    type: '',
    logoOnly: false
};

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            type: this.props.type
        }
    }

    getTabs() {
        // default access: only Help page
        let tabNames = {
            Help: 'help'
        };

        console.log(this.state.type)

        if (this.props.logoOnly) {
            tabNames = {};
        }
        else if (this.state.type === 'fabs') {
            // user has FABS permissions
            const fabsWrite = this.props.session.admin || PermissionHelper.checkFabsPermissions(this.props.session);
            tabNames = {
                Home: 'FABSlanding',
                'Upload & Validate New Submission': fabsWrite ? 'FABSaddData' : 'disabled',
                'Submission Dashboard': 'FABSdashboard',
                Help: 'FABShelp'
            };
        }
        else if (this.state.type === 'dabs') {
            // user has DABS permissions
            const dabsWrite = this.props.session.admin || PermissionHelper.checkPermissions(this.props.session);
            tabNames = {
                Home: 'landing',
                'Upload & Validate New Submission': dabsWrite ? 'submissionGuide' : 'disabled',
                'Submission Dashboard': 'dashboard',
                Help: 'help'
            };
        }
        return tabNames;
    }

    logout(e) {
        e.preventDefault();
        this.props.setSession({
            login: 'loggedOut',
            user: {},
            admin: false,
            skipGuide: false
        });
    }

    handleChange(e) {
        this.setState({type: e.target.value})
    }

    render() {
        const tabNames = this.getTabs();

        const headerTabs = [];
        const context = this;
        const userText = this.props.session.user === '' ? '' : this.props.session.user.name;

        let userButton = null;
        if (this.props.session.login === "loggedIn") {
            userButton = <UserButton buttonText={userText} logout={this.logout.bind(this)} />;
        }

        Object.keys(tabNames).map((key) => {
            headerTabs.push(<NavbarTab
                key={tabNames[key]}
                name={key}
                tabClass={tabNames[key]}
                activeTabClassName={context.props.activeTab} />);
        });

        let navClass = "";
        let testBanner = null;
        if (!kGlobalConstants.PROD) {
            navClass = " tall";
            testBanner = <TestEnvironmentBanner />;
        }

        return (
            <nav className={"navbar navbar-default usa-da-header" + navClass}>
                <SkipNavigationLink />
                <a className="hidden-screen-reader" href="#">Home</a>
                {testBanner}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 usa-da-top-head">
                            <div className="container">
                                <ul className="usa-da-top-head-menu mr-15">
                                    {userButton}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="container usa-da-header-container">
                        <div className="navbar-header usa-da-header-navbar">
                            <button
                                type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1"
                                aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <span className="navbar-brand usa-da-header-brand">
                                <span className="brand">
                                    <a href="#/">DATA Act Broker</a>
                                    <div className="vert-bar" />
                                </span>
                                <select
                                    className={"navbar-selector " + this.state.type}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.type}>
                                    <option value="fabs">
                                        Financial Assistance Broker Submission (FABS)
                                    </option>
                                    <option value="dabs">
                                        Data Act Broker Submission (DABS)
                                    </option>
                                </select>
                            </span>
                        </div>

                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul id="usa-da-header-link-holder" className="nav navbar-nav navbar-right">
                                {headerTabs}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

export default connect(
    (state) => ({ session: state.session }),
    (dispatch) => bindActionCreators(sessionActions, dispatch)
)(Navbar);
