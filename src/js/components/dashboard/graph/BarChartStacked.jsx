/**
 * BarChartStacked.jsx
 * Created by Lizzie Salita 11/15/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleBand } from 'd3-scale';
import { min, max } from 'lodash';
import { formatNumberWithPrecision } from 'helpers/moneyFormatter';
import { calculateLegendOffset } from 'helpers/stackedBarChartHelper';

import BarChartXAxis from './BarChartXAxis';
import BarChartYAxis from './BarChartYAxis';
import BarChartLegend from './BarChartLegend';
import StackedBarGroup from './StackedBarGroup';

/* eslint-disable react/no-unused-prop-types */
// allow unused prop types. they are indirectly accessed as nextProps
const propTypes = {
    xSeries: PropTypes.arrayOf(PropTypes.string),
    ySeries: PropTypes.arrayOf(PropTypes.object),
    allY: PropTypes.arrayOf(PropTypes.number),
    height: PropTypes.number,
    width: PropTypes.number,
    padding: PropTypes.object,
    legend: PropTypes.array,
    showTooltip: PropTypes.func,
    hideTooltip: PropTypes.func,
    toggleTooltip: PropTypes.func
};
/* eslint-enable react/no-unused-prop-types */

const defaultProps = {
    padding: {
        left: 70,
        bottom: 50,
        right: 80
    }
};

export default class BarChartStacked extends React.Component {
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
        if (prevProps.xSeries !== this.props.xSeries ||
            prevProps.ySeries !== this.props.ySeries ||
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
            ySeries: props.ySeries,
            stacks: props.legend
        };

        // calculate what the visible area of the chart itself will be (excluding the axes and their
        // labels)
        values.graphHeight = values.height - props.padding.bottom;
        values.graphWidth = values.width - props.padding.left - props.padding.right;
        values.padding = props.padding;

        // build a virtual representation of the chart first
        // when we actually draw the chart, we won't need to do any more calculations

        // calculate the Y axis range
        const yRange = [min(values.allY), max(values.allY)];
        if (values.allY.length === 1) {
            yRange[0] = 0;
        }

        // build the D3 scale objects for each axis
        // remember, in D3 scales, domain is the data range (or data set for non-continuous data)
        // and range is the range of possible pixel positions along the axis
        values.xScale = scaleBand()
            .domain(values.xSeries)
            .range([0, values.graphWidth])
            .round(true);

        // have an inverted range so that the yScale output returns the correct Y position within
        // the SVG element (y = 0 is the top of the graph)
        values.yScale = scaleLinear()
            .domain(yRange)
            .range([values.graphHeight, 0])
            .clamp(true);

        // now we need to build the X and Y axes
        const yAxis = this.buildVirtualYAxis(values);
        const xAxis = this.buildVirtualXAxis(values);

        // now build the chart body
        const body = this.buildVirtualBody(values);

        const chart = {
            yAxis,
            xAxis,
            body
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
                label: x,
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

    buildVirtualBody(values) {
        const body = {
            items: [],
            group: {
                x: values.padding.left,
                y: 0
            }
        };

        // put 20px padding on each side of the group with a minimum width of 66px
        const barWidth = Math.min(values.xScale.bandwidth() - 40, 66);
        const zeroY = values.yScale(0);

        values.xSeries.forEach((x, index) => {
            const y = values.ySeries[index];

            let xPos = values.xScale(x) + 20;
            if (barWidth === 66) {
                // the total width of the group is no longer guaranteed to equal the bandwidth
                // since each bar now maxes out at 66px

                // the starting point should be the center of the X label
                // (the group start X pos + half the band width), then adjusted left for the
                // total group width (subtract by half the real width)
                xPos = (values.xScale(x) + (values.xScale.bandwidth() / 2)) - (66 / 2);
            }

            const item = {
                xPos,
                xValue: x,
                stack: [],
                hitzone: {
                    width: barWidth,
                    height: values.graphHeight
                },
                tooltip: {
                    values: [],
                    xValue: x,
                    position: {
                        x: xPos + (barWidth / 2) + values.padding.left,
                        y: 0
                    }
                }
            };

            // build the tooltip data
            const tooltip = [];
            let maxY = 0;

            // iterate through each stacked item
            values.stacks.forEach((stack) => {
                // get the data for the stacked item
                const data = y[stack.label];

                // determine the Y position of the top of the bar
                let yPos = values.yScale(data.top);
                let height = 0;
                // calculate height by getting the Y position of the bottom of
                // the bar and taking the difference
                height = values.yScale(data.bottom) - yPos;
                // however, if the bar shows a negative value but extends to a 0 or positive
                // value, the "top" of the bar is actually visually the bottom - and the
                // "bottom" bar (the visual top) is the X axis
                if (data.top < 0 && data.bottom >= 0) {
                    yPos = zeroY;
                    height = values.yScale(data.top) - zeroY;
                }
                else if (data.top < 0) {
                    // if the bar shows a negative value and it is entirely negative (the
                    // two endpoints of the bar are both in the negative region), use the
                    // least negative value as the top point of the bar and the most negative
                    // value as the bottom (and height is again the difference between the two)
                    yPos = values.yScale(Math.max(data.bottom, data.top));
                    height = values.yScale(Math.min(data.bottom, data.top)) - yPos;
                }

                // merge the positioning of the stacked item with its metadata
                const element = Object.assign({}, stack, {
                    height,
                    width: barWidth,
                    x: 0,
                    y: yPos,
                    xValue: x,
                    value: data.value,
                    description: data.description
                });
                item.stack.push(element);

                // add the value to the tooltip
                tooltip.push({
                    label: data.description,
                    value: data.value,
                    percent: data.percent,
                    type: stack.label
                });

                // get the highest Y position for the tooltip
                if (yPos > maxY) {
                    maxY = yPos;
                }
            });

            // reverse the array so that the first elements are rendered last (in front)
            item.stack.reverse();

            // update the tooltip values (this won't be reversed)
            item.tooltip.values = tooltip;
            item.tooltip.position.y = (maxY / 2);

            // draw a bar for each item
            body.items.push(item);
        });

        return body;
    }

    render() {
        // the chart hasn't been created yet, so don't render anything
        if (!this.state.chartReady) {
            return null;
        }
        const legendOffset = calculateLegendOffset(
            this.props.legend.length, // number of items in the legend
            this.props.height - this.props.padding.bottom // height of the graph
        );

        const body = this.state.virtualChart.body.items.map((item) => (
            <StackedBarGroup
                {...item}
                key={item.xValue} />
        ));

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
                    <g
                        className="legend-container"
                        transform={`translate(${this.props.width - 68}, ${legendOffset})`}>
                        <BarChartLegend legend={this.props.legend} />
                    </g>
                    <g
                        className="bar-data"
                        transform={`translate(${this.state.virtualChart.body.group.x},\
                            ${this.state.virtualChart.body.group.y})`}>
                        {body}
                    </g>
                </svg>
            </div>
        );
    }
}

BarChartStacked.propTypes = propTypes;
BarChartStacked.defaultProps = defaultProps;
