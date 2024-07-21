import React from 'react';
import {render} from '@testing-library/react';
import Home from '@/pages/index';

describe('<Home>', () => {
  it('should render component', () => {
    const {asFragment} = render(<Home />)
    expect(asFragment()).toMatchSnapshot();
  });
  
});