import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookViewer from '@/components/BookViewer';
import { storage } from '@/api/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

// Mock Firebase storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: (props: any) => <div data-testid="canvas">{props.children}</div>,
}));

// Mock the Model component
jest.mock('@/components/Model', () => () => <div data-testid="model" />);

describe('<BookViewer>', () => {
  const bookName = 'test-book';
  const mockUrl = 'https://example.com/model.glb';
  
  beforeEach(() => {
    (ref as jest.Mock).mockReturnValue({});
    (getDownloadURL as jest.Mock).mockResolvedValue(mockUrl);
  });

  it('renders without crashing and displays loading indicator', () => {
    render(<BookViewer bookName={bookName} />);
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('fetches and displays model URL', async () => {
    render(<BookViewer bookName={bookName} />);

    await waitFor(() => {
      expect(getDownloadURL).toHaveBeenCalledWith(ref(storage, `models/${bookName}.glb`));
      expect(screen.getByTestId('model')).toBeInTheDocument();
    });
  });

  it('shows error message when fetching model URL fails', async () => {
    const errorMessage = 'Could not load model. Please try again later.';
    
    (getDownloadURL as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    render(<BookViewer bookName={bookName} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
