import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryStoriesPage from '@/pages/category/[id]'; // Pfad zur Seite
import { useRouter } from 'next/router';
import { useStories } from '@/hooks/useStories';

// Mock necessary modules
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useStories', () => ({
  useStories: jest.fn(),
}));

jest.mock('@/components/Loading', () => () => <div>Loading...</div>);
jest.mock('@/components/Book', () => () => <div>Book Component</div>);

describe('<CategoryStoriesPage>', () => {
  const mockPush = jest.fn();
  const mockUseStories = useStories as jest.Mock;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: 'test-category' },
      push: mockPush,
    });

    mockUseStories.mockReturnValue({
      stories: [],
      loading: false,
      searchQuery: '',
      handleSearchChange: jest.fn(),
    });

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders and loads StoriesPage component', async () => {
    render(<CategoryStoriesPage />);
    // Check if the StoriesPage component is rendered
    expect(screen.getByText('test-category')).toBeInTheDocument();
    expect(screen.getByText('Kategorien durchsuchen')).toBeInTheDocument();
    expect(screen.getByText('+ Erstellen')).toBeInTheDocument();
  });

  it('shows loading state when data is loading', async () => {
    mockUseStories.mockReturnValueOnce({
      stories: [],
      loading: true,
      searchQuery: '',
      handleSearchChange: jest.fn(),
    });

    render(<CategoryStoriesPage />);
    // Check if loading state is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('navigates to create book page on button click', async () => {
    render(<CategoryStoriesPage />);
    // Simulate clicking the "Erstellen" button
    fireEvent.click(screen.getByText('+ Erstellen'));
    // Check if the router push function is called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/story/new');
  });

  it('navigates to shelf category page on button click', async () => {
    render(<CategoryStoriesPage />);
    // Simulate clicking the "Kategorien durchsuchen" button
    fireEvent.click(screen.getByText('Kategorien durchsuchen'));
    // Check if the router push function is called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/category/shelf');
  });
});
