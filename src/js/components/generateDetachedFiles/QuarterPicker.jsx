/**
 * QuarterPicker.jsx
 * Created by Lizzie Salita 11/5/18
 */

import React, { PropTypes } from 'react';

import { availableQuartersInFY } from '../../helpers/quarterPickerHelper';

import FYPicker from './FYPicker';
import QuarterButton from './QuarterButton';

const propTypes = {
    fy: PropTypes.string.isRequired,
    quarter: PropTypes.number.isRequired,
    pickedQuarter: PropTypes.func.isRequired,
    pickedYear: PropTypes.func.isRequired
};

export default class QuarterPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quarters: {
                Q1: false,
                Q2: false,
                Q3: false,
                Q4: false
            }
        };

        this.hoveredQuarter = this.hoveredQuarter.bind(this);
        this.highlightCurrentSelection = this.highlightCurrentSelection.bind(this);
    }

    componentDidMount() {
        this.highlightCurrentSelection();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quarter !== this.props.quarter || prevProps.fy !== this.props.fy) {
            this.highlightCurrentSelection();
        }
    }

    hoveredQuarter(quarter) {
        const availableQuarters = availableQuartersInFY(this.props.fy).quarters;
        const newState = {};
        for (let i = 1; i <= 4; i++) {
            newState[`Q${i}`] = Boolean(quarter >= i && availableQuarters.indexOf(i) > -1);
        }

        this.setState({
            quarters: newState
        });
    }

    highlightCurrentSelection() {
        this.hoveredQuarter(parseInt(this.props.quarter, 10));
    }

    render() {
        const availableQuarters = availableQuartersInFY(this.props.fy).quarters;
        return (
            <div className="quarter-picker">
                <div className="quarter-picker__fy">
                    <FYPicker
                        fy={this.props.fy}
                        pickedYear={this.props.pickedYear} />
                </div>
                <ul className="quarter-picker__list">
                    <li className="quarter-picker__list-item">
                        <QuarterButton
                            quarter={1}
                            hoveredQuarter={this.hoveredQuarter}
                            endHover={this.highlightCurrentSelection}
                            pickedQuarter={this.props.pickedQuarter}
                            disabled={availableQuarters.indexOf(1) === -1}
                            active={this.state.quarters.Q1}
                            first />
                    </li>
                    <li className="quarter-picker__list-item">
                        <QuarterButton
                            quarter={2}
                            hoveredQuarter={this.hoveredQuarter}
                            endHover={this.highlightCurrentSelection}
                            pickedQuarter={this.props.pickedQuarter}
                            disabled={availableQuarters.indexOf(2) === -1}
                            active={this.state.quarters.Q2} />
                    </li>
                    <li className="quarter-picker__list-item">
                        <QuarterButton
                            quarter={3}
                            hoveredQuarter={this.hoveredQuarter}
                            endHover={this.highlightCurrentSelection}
                            pickedQuarter={this.props.pickedQuarter}
                            disabled={availableQuarters.indexOf(3) === -1}
                            active={this.state.quarters.Q3} />
                    </li>
                    <li className="quarter-picker__list-item">
                        <QuarterButton
                            quarter={4}
                            hoveredQuarter={this.hoveredQuarter}
                            endHover={this.highlightCurrentSelection}
                            pickedQuarter={this.props.pickedQuarter}
                            disabled={availableQuarters.indexOf(4) === -1}
                            active={this.state.quarters.Q4}
                            last />
                    </li>
                </ul>
            </div>
        );
    }
}

QuarterPicker.propTypes = propTypes;
