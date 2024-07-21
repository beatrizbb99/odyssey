import {render} from '@testing-library/react';
import React from 'react';
import ModelViewer from '@/components/ModelViewer';

jest.mock('@react-three/fiber');
jest.mock('@react-three/drei');
jest.mock('../api/firebase');
jest.mock('firebase/storage');
jest.mock('three');

describe('<ModelViewer>', () => {
  it('should render component', () => {
    const {asFragment} = render(<ModelViewer  
      modelName={"basic_book_test"} />)
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render component with props', () => {
    const {asFragment} = render(<ModelViewer  
    modelName={"basic_book_test"} />)
    expect(asFragment()).toMatchSnapshot();
  });
});