/**
 * FileFilterContainer.jsx
 * Created by Lizzie Salita 10/30/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as filterActions from 'redux/actions/dashboard/dashboardFilterActions';
import RadioGroup from 'components/SharedComponents/RadioGroup';

const propTypes = {
    updateFileFilter: PropTypes.func,
    selectedFilters: PropTypes.object
};

const columns = [
    [
        {
            value: 'A',
            label: 'File A'
        },
        {
            value: 'B',
            label: 'File B'
        },
        {
            value: 'C',
            label: 'File C'
        }
    ],
    [
        {
            value: 'cross-AB',
            label: 'Cross: A/B'
        },
        {
            value: 'cross-BC',
            label: 'Cross: B/C'
        },
        {
            value: 'cross-CD1',
            label: 'Cross: C/D1'
        },
        {
            value: 'cross-CD2',
            label: 'Cross: C/D2'
        }
    ]
];

const FileFilterContainer = (props) => (
    <div className="file-options">
        <RadioGroup
            onChange={props.updateFileFilter}
            currentValue={props.selectedFilters.file}
            columns={columns} />
    </div>
);

FileFilterContainer.propTypes = propTypes;

export default connect(
    (state) => ({
        selectedFilters: state.dashboardFilters
    }),
    (dispatch) => bindActionCreators(filterActions, dispatch),
)(FileFilterContainer);