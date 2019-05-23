/**
 * DashboardContainer-test.jsx
 * Created by Max Kizendall 05/23/19
 */

import React from 'react';
import { shallow } from 'enzyme';

import { FilterBarContainer } from 'containers/dashboard/FilterBarContainer';
import { mockActions, mockRedux } from './mockData';

describe('<FilterBarContainer />', () => {
    it('should call prepareFilters if applied filters exist', () => {
        const mockReduxWithAgencyFilter = Object.assign(mockRedux, {
            appliedFilters: Object.assign(mockRedux.appliedFilters, {
                dabs: Object.assign(mockRedux.appliedFilters.dabs, {
                    active: Object.assign(mockRedux.appliedFilters.dabs.active, {
                        agencies: ["test"]
                    })
                })
            })
        });
        const container = shallow(<FilterBarContainer
            {...mockReduxWithAgencyFilter}
            {...mockActions}
            type="dabs"
            table="active" />);
        const test = jest.fn();
        container.prepareFilters = test;
        container.instance().componentDidMount();
        expect(test).toHaveBeenCalledTimes(1);
    });
});
