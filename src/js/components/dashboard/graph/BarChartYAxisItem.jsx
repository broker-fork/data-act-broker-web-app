/**
 * BarChartYAxisItem.jsx
 * Created by Lizzie Salita 11/18/19
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    label: PropTypes.object,
    gridLine: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number
};

const BarChartYAxisItem = (props) => (
    <g
        className="axis-item y-axis"
        transform={`translate(0,${props.y})`}>
        <text
            transform={`translate(${props.label.x},${props.label.y})`}
            textAnchor="end">
            {props.label.text}
        </text>
        <g className="grid-line">
            <line
                className="grid-line__line"
                x1={props.gridLine.x1 + 1}
                x2={props.gridLine.x2}
                y1={props.gridLine.y1}
                y2={props.gridLine.y2} />
            <rect
                className={`grid-line__row${props.gridLine.even ? ' grid-line__row_even' : ''}`}
                transform={`translate(1, -${props.gridLine.height})`}
                width={props.gridLine.width - 1}
                height={props.gridLine.height - 1} />
        </g>
    </g>
);

BarChartYAxisItem.propTypes = propTypes;

export default BarChartYAxisItem;
