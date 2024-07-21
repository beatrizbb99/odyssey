import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableStory from '@/components/EditableStory';
import { useRouter } from 'next/router';
import { fetchStory } from '@/services/story.database.handler';
import EditStory from '@/components/EditStory';
import EditChapters from '@/components/EditChapters';
import Loading from '@/components/Loading';
import { ToastContainer, toast } from 'react-toastify';

// Mock the necessary modules
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/story.database.handler', () => ({
  fetchStory: jest.fn(),
}));

jest.mock('@/components/Loading', () => () => <div>Loading...</div>);
jest.mock('@/components/EditStory', () => () => <div>EditStory Component</div>);
jest.mock('@/components/EditChapters', () => () => <div>EditChapters Component</div>);

jest.mock('react-toastify', () => ({
    ToastContainer: () => <div>ToastContainer</div>,
    toast: jest.fn(),  // Use jest.fn() to create a mock function
}));

describe('<EditableStory>', () => {
  const mockPush = jest.fn();
  const mockFetchStory = fetchStory as jest.Mock;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: '1' },
      push: mockPush,
    });

    mockFetchStory.mockResolvedValue({
      id: '1',
      title: 'Test Story',
      modelName: 'Test Model',
      chapters: [],
      categories: [],
      description: '',
      coverUrl: '',
      color: '#ffffff'
    });

    jest.clearAllMocks();  // Clear any previous mocks
  });

  it('renders and loads story', async () => {
    render(<EditableStory />);

    // Check if loading state is displayed initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for story to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check if the EditStory and EditChapters components are not rendered initially
    expect(screen.queryByText('EditStory Component')).not.toBeInTheDocument();
    expect(screen.queryByText('EditChapters Component')).toBeInTheDocument();
  });

  it('switches between edit modes', async () => {
    render(<EditableStory />);

    // Wait for story to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check initial mode (editChapters)
    expect(screen.getByText('EditChapters Component')).toBeInTheDocument();
    expect(screen.queryByText('EditStory Component')).not.toBeInTheDocument();

    // Switch to editStory mode
    fireEvent.click(screen.getByText('Details zur Geschichte'));

    // Check if the mode switched to editStory
    expect(screen.getByText('EditStory Component')).toBeInTheDocument();
    expect(screen.queryByText('EditChapters Component')).not.toBeInTheDocument();
  });

  it('handles story update and shows toast', async () => {
    render(<EditableStory />);

    // Wait for story to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Mock handleUpdateStory
    const updatedStory = {
      id: '1',
      title: 'Updated Story',
      modelName: 'Test Model',
      chapters: [],
      categories: [],
      description: '',
      coverUrl: '',
      color: '#ffffff'
    };

    act(() => {
      const editChaptersButton = screen.getByText('Kapitel').closest('button');
      if (editChaptersButton) {
        fireEvent.click(editChaptersButton); // Switch to editChapters mode to call handleUpdateStory
      }

      const editStoryButton = screen.getByText('Details zur Geschichte').closest('button');
      if (editStoryButton) {
        fireEvent.click(editStoryButton); // Ensure we're in the correct mode
      }
      
      const instance = screen.getByText('EditStory Component').closest('div');
      if (instance) {
        const updateButton = instance.querySelector('button'); // Assume there's an update button in EditStory
        if (updateButton) {
          fireEvent.click(updateButton);
        }
      }
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Story updated successfully', {
        autoClose: 1000,
        icon: expect.anything(),
      });
    });
  });
});
