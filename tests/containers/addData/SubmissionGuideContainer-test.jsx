/**
 * SubmissionGuideContainer-test.jsx
 * Created by Lizzie Salita 09/13/19
 */

import React from 'react';
import { shallow } from 'enzyme';

import { SubmissionGuideContainer } from 'containers/addData/SubmissionGuideContainer';
import { forceGuideProps, skipGuideProps, showGuideProps } from './mockData';

// mock the submission guide helper
jest.mock('helpers/submissionGuideHelper', () => require('./mockSubmissionGuideHelper'));

// mock the child component by replacing it with a function that returns a null element
jest.mock('components/addData/SubmissionGuidePage', () => jest.fn(() => null));

describe('SubmissionGuideContainer', () => {
    it('show the add data screen when users have opted to skip the guide and the guide is not forced via url', () => {
        const container = shallow(<SubmissionGuideContainer {...skipGuideProps} />);

        const sendToAddData = jest.fn();
        container.instance().sendToAddData = sendToAddData;
        container.instance().componentDidMount();

        expect(sendToAddData).toHaveBeenCalled();
    });
    it('should not re-route to the add data page when the guide is forced via url', () => {
        const container = shallow(<SubmissionGuideContainer
            {...forceGuideProps} />);

        const sendToAddData = jest.fn();
        container.instance().sendToAddData = sendToAddData;
        container.instance().componentDidMount();

        expect(sendToAddData).toHaveBeenCalledTimes(0);
    });
    it('should not re-route to the add data page when the user has not opted to bypass the guide', () => {
        const container = shallow(<SubmissionGuideContainer {...showGuideProps} />);

        const sendToAddData = jest.fn();
        container.instance().sendToAddData = sendToAddData;
        container.instance().componentDidMount();

        expect(sendToAddData).toHaveBeenCalledTimes(0);
    });
});
