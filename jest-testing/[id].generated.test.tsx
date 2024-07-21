import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoryView from '@/pages/story/[id]';
import { fetchStory } from '@/services/story.database.handler';

// Mock the fetchStory function
jest.mock('@/services/story.database.handler', () => ({
  fetchStory: jest.fn(),
}));

// Mock useRouter
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  query: { id: '123' },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('StoryView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetchStory as jest.Mock).mockResolvedValueOnce({ title: 'Story Title', chapters: [] });
    render(<StoryView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders story details after loading', async () => {
    const mockStory = {
      title: 'Story Title',
      chapters: [
        { title: 'Chapter 1', content: 'Chapter 1 content' },
        { title: 'Chapter 2', content: 'Chapter 2 content' },
      ],
      modelName: 'BookModel'
    };
    (fetchStory as jest.Mock).mockResolvedValueOnce(mockStory);

    render(<StoryView />);

    // Check for loading message
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

    // Check story title and chapter content
    expect(screen.getByText('Story Title')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1 content')).toBeInTheDocument();
  });
});
