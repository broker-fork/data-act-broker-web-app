/**
 * DashboardContainer-test.jsx
 * Created by Max Kizendall 05/23/19
 */

import React from 'react';
import { shallow } from 'enzyme';

import { FilterBarContainer } from 'containers/dashboard/FilterBarContainer';
import { mockRedux } from './mockData';

describe('<FilterBarContainer />', () => {
    it('should call prepareFilters if applied filters exist', async () => {
        const filter = Object.assign(mockRedux.appliedFilters.dabs.active, {
            agencies: ["test"]
        });
        const spy = jest.fn();
        const container = shallow(<FilterBarContainer
            appliedFilters={filter}
            stagedFilters={mockRedux.stagedFilters.dabs.active}
            updateFilterCount={jest.fn()}
            type="dabs"
            table="active" />);
        const instance = container.instance();
        instance.prepareFilters = spy;
        await instance.componentDidMount();
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should not call prepareFilters if applied filters do not exist', async () => {
        const spy = jest.fn();
        const container = shallow(<FilterBarContainer
            appliedFilters={mockRedux.stagedFilters.dabs.active}
            stagedFilters={mockRedux.stagedFilters.dabs.active}
            updateFilterCount={jest.fn()}
            type="dabs"
            table="active" />);
        const instance = container.instance();
        instance.prepareFilters = spy;
        await instance.componentDidMount();
        expect(spy).toHaveBeenCalledTimes(0);
    });
});
