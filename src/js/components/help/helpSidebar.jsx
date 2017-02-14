/**
 * HelpSidebar.jsx
 * Created by Mike Bray 4/1/16
 **/

import React from 'react';
import HelpSidebarItem from './helpSidebarItem.jsx';

export default class HelpSidebar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const sectionList = this.props.sections.map((section, index) => {
            return <HelpSidebarItem key={index} sectionName={section.name} sectionId={section.link} />
        });

        let membership = null;
        if(this.props.helpOnly){
            membership=
                     <li>
                        <a href="/#/help?section=agencyAccess">Request Agency Access</a>
                    </li>;
        }
        

        return (
            <div className="usa-da-help-sidebar">
                <h6>What’s New in This Release</h6>
                <ul>
                    {sectionList}
					<li>
                        <a href="/#/history">Release Notes Archive</a>
                    </li>
                </ul>
                <h6>Getting More Help</h6>
                <ul>
                    {membership}
                    <li>
                        <a href="/#/help?section=filingIssue">Filing an Issue</a>
                    </li>
		    <li>
                        <a href="/#/resources">Resources - DAIMS</a>
                    </li>
		    <li>
                        <a href="/#/validations">Validations</a>
                    </li>
                </ul>
            </div>
        );
    }
}
