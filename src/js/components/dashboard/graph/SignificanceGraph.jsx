/**
 * SignificanceGraph.jsx
 * Created by Lizzie Salita 3/27/20
 */

import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, isEqual } from 'lodash';
import { formatNumberWithPrecision } from 'helpers/moneyFormatter';
import BarChartXAxis from './BarChartXAxis';
import BarChartYAxis from './BarChartYAxis';

/* eslint-disable react/no-unused-prop-types */
// allow unused prop types. they are indirectly accessed as nextProps
const propTypes = {
    xSeries: PropTypes.arrayOf(PropTypes.number),
    ySeries: PropTypes.arrayOf(PropTypes.object),
    allY: PropTypes.arrayOf(PropTypes.number),
    height: PropTypes.number,
    width: PropTypes.number,
    padding: PropTypes.object
};
/* eslint-enable react/no-unused-prop-types */

const defaultProps = {
    padding: {
        left: 70,
        bottom: 50,
        right: 80
    }
};

export default class SignificanceGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartReady: false,
            virtualChart: {}
        };
    }

    componentDidMount() {
        this.buildVirtualChart(this.props);
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.xSeries, this.props.xSeries) ||
            !isEqual(prevProps.ySeries, this.props.ySeries) ||
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height) {
            this.buildVirtualChart(this.props);
        }
    }

    buildVirtualChart(props) {
        const values = {
            width: props.width,
            height: props.height,
            allY: props.allY,
            xSeries: props.xSeries,
            ySeries: props.ySeries
        };

        // calculate what the visible area of the chart itself will be (excluding the axes and their
        // labels)
        values.graphHeight = values.height - props.padding.bottom;
        values.graphWidth = values.width - props.padding.left - props.padding.right;
        values.padding = props.padding;

        // build a virtual representation of the chart first
        // when we actually draw the chart, we won't need to do any more calculations

        // calculate the Y axis range
        const yRange = [0, max(values.allY)];

        // build the D3 scale objects for each axis
        // remember, in D3 scales, domain is the data range (or data set for non-continuous data)
        // and range is the range of possible pixel positions along the axis
        values.xScale = scaleBand()
            .domain(values.xSeries)
            .range([0, values.graphWidth]);

        // have an inverted range so that the yScale output returns the correct Y position within
        // the SVG element (y = 0 is the top of the graph)
        values.yScale = scaleLinear()
            .domain(yRange)
            .range([values.graphHeight, 0])
            .clamp(true);

        // now we need to build the X and Y axes
        const yAxis = this.buildVirtualYAxis(values);
        const xAxis = this.buildVirtualXAxis(values);


        const chart = {
            yAxis,
            xAxis
        };

        this.setState({
            virtualChart: chart,
            chartReady: true
        });
    }

    buildVirtualYAxis(values) {
        const yAxis = {
            items: [],
            line: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: values.graphHeight
            },
            group: {
                x: values.padding.left,
                y: 0
            },
            title: 'Y-Axis'
        };

        // generate the tick marks
        const tickPoints = values.yScale.ticks(10);

        // Find the distance (in px) between tick marks
        let height = 1;
        if (tickPoints.length > 1) {
            const y1 = values.yScale(tickPoints[0]);
            const y2 = values.yScale(tickPoints[1]);
            height = Math.abs(y2 - y1) || 1;
        }

        // create ticks and grid lines at each point
        tickPoints.forEach((y) => {
            // create the label
            const labelText = formatNumberWithPrecision(y, 0);

            // set all the labels 10px left of the edge of Y axis
            // all labels should be 6px below the grid line
            const label = {
                text: labelText,
                x: -10,
                y: 6,
                value: y
            };

            // now create the gridline
            const gridLine = {
                x1: 0,
                x2: values.graphWidth,
                y1: 0,
                y2: 0,
                height,
                width: values.graphWidth,
                value: y
            };

            const item = {
                label,
                gridLine,
                x: values.padding.left,
                y: values.yScale(y)
            };
            yAxis.items.push(item);
        });

        yAxis.description = `The Y-axis of the chart, showing a range of values from \
${yAxis.items[0].label.text} to ${yAxis.items[yAxis.items.length - 1].label.text}.`;

        return yAxis;
    }

    buildVirtualXAxis(values) {
        const xAxis = {
            items: [],
            line: {
                x1: 0,
                x2: values.graphWidth,
                y1: 0,
                y2: 0
            },
            lineGroup: {
                x: values.padding.left,
                y: values.yScale(0)
            },
            labelGroup: {
                x: values.padding.left,
                y: values.graphHeight + 27
            },
            title: 'X-Axis'
        };

        // go through each X axis item and add a label
        const barWidth = values.xScale.bandwidth();
        values.xSeries.forEach((x) => {
            // we need to center the label within the bar width
            const xPos = values.xScale(x) + (barWidth / 2);

            const item = {
                label: `${x}`,
                value: x,
                y: 0,
                x: xPos
            };
            xAxis.items.push(item);
        });

        xAxis.description = `The X-axis of the chart, showing a range of values from \
${xAxis.items[0].label} to ${xAxis.items[xAxis.items.length - 1].label}.`;

        return xAxis;
    }

    render() {
        // the chart hasn't been created yet, so don't render anything
        if (!this.state.chartReady) {
            return null;
        }

        return (
            <div>
                <svg
                    className="bar-graph"
                    width={this.props.width}
                    height={this.props.height + 20}>
                    <BarChartYAxis
                        {...this.state.virtualChart.yAxis}
                        x={this.state.virtualChart.yAxis.group.x}
                        y={this.state.virtualChart.yAxis.group.y} />
                    <BarChartXAxis
                        {...this.state.virtualChart.xAxis} />
                </svg>
            </div>
        );
    }
}

SignificanceGraph.propTypes = propTypes;
SignificanceGraph.defaultProps = defaultProps;
