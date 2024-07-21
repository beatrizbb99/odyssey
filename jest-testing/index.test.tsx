import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllStoriesPage from '@/pages/story/index';
import StoriesPage from '@/components/StoriesPage';
import { useRouter } from 'next/router';
import { useStories } from '@/hooks/useStories';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock useStories
jest.mock('@/hooks/useStories', () => ({
  useStories: jest.fn(),
}));

// Mock the Loading component
jest.mock('@/components/Loading', () => () => <div>Loading...</div>);

describe('<AllStoriesPage>', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders AllStoriesPage correctly', () => {
    render(<AllStoriesPage />);
    expect(screen.getByText('Alle Geschichten')).toBeInTheDocument();
  });
});

describe('<StoriesPage>', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders StoriesPage with stories', () => {
    (useStories as jest.Mock).mockReturnValue({
      stories: [
        { title: 'Story 1', content: 'Content 1' },
        { title: 'Story 2', content: 'Content 2' }
      ],
      loading: false,
      searchQuery: '',
      handleSearchChange: jest.fn()
    });

    render(<StoriesPage title="Test Title" />);

    // Check if title is rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText('Kategorien durchsuchen')).toBeInTheDocument();
    expect(screen.getByText('+ Erstellen')).toBeInTheDocument();

    // Check if stories are rendered
    expect(screen.getByText('Story 1')).toBeInTheDocument();
    expect(screen.getByText('Story 2')).toBeInTheDocument();
  });

  it('navigates to /story/new when + Erstellen is clicked', () => {
    (useStories as jest.Mock).mockReturnValue({
      stories: [],
      loading: false,
      searchQuery: '',
      handleSearchChange: jest.fn()
    });

    render(<StoriesPage title="Test Title" />);
    fireEvent.click(screen.getByText('+ Erstellen'));
    expect(mockPush).toHaveBeenCalledWith('/story/new');
  });

  it('navigates to /category/shelf when Kategorien durchsuchen is clicked', () => {
    (useStories as jest.Mock).mockReturnValue({
      stories: [],
      loading: false,
      searchQuery: '',
      handleSearchChange: jest.fn()
    });

    render(<StoriesPage title="Test Title" />);
    fireEvent.click(screen.getByText('Kategorien durchsuchen'));
    expect(mockPush).toHaveBeenCalledWith('/category/shelf');
  });

  it('updates search query on input change', () => {
    const handleSearchChange = jest.fn();
    (useStories as jest.Mock).mockReturnValue({
      stories: [],
      loading: false,
      searchQuery: '',
      handleSearchChange
    });

    render(<StoriesPage title="Test Title" />);

    fireEvent.change(screen.getByPlaceholderText('Suchen...'), { target: { value: 'New Query' } });

    expect(handleSearchChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('renders Loading component when loading is true', () => {
    (useStories as jest.Mock).mockReturnValue({
      stories: [],
      loading: true,
      searchQuery: '',
      handleSearchChange: jest.fn()
    });

    render(<StoriesPage title="Test Title" />);

    // Check if Loading component is rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
