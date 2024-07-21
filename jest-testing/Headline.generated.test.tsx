import React from 'react';
import {render} from '@testing-library/react';
import Headline from '@/pages/Headline'

describe('<Headline>', () => {
  it('should render component', () => {
    const { asFragment } = render(<Headline />);
    expect(asFragment()).toMatchSnapshot();
  });
});