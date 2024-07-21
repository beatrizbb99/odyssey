import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateStory from '@/pages/story/new'
import { useRouter } from 'next/router';
import { saveStory, uploadCoverImage, addChapterToStory } from '@/services/story.database.handler';
import { useStoryForm } from '@/hooks/useStoryForm';

// Mock services
jest.mock('@/services/story.database.handler', () => ({
  saveStory: jest.fn(),
  uploadCoverImage: jest.fn(),
  addChapterToStory: jest.fn(),
}));

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock useStoryForm hook
jest.mock('@/hooks/useStoryForm', () => ({
  useStoryForm: jest.fn(),
}));

describe('CreateStory', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useStoryForm as jest.Mock).mockReturnValue({
      title: 'Test Title',
      categories: ['Category1', 'Category2'],
      selectedCategories: ['Category1'],
      description: 'Test Description',
      loadingCategories: false,
      modelName: 'Test Model',
      handleTitleChange: jest.fn(),
      handleDescriptionChange: jest.fn(),
      handleCategoryChange: jest.fn(),
      isFormValid: true,
      coverFile: null,
      coverUrl: 'http://example.com/cover.jpg',
      handleCoverChange: jest.fn(),
      handleCancel: jest.fn(),
      validateForm: jest.fn(),
      error: '',
      handleColorChange: jest.fn(),
      color: '#ffffff'
    });
    jest.clearAllMocks();
  });

  it('renders CreateStory component', () => {
    render(<CreateStory />);
    expect(screen.getByText(/Erstelle eine neue Geschichte/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categories/i)).toBeInTheDocument();
  });

  it('updates title and description on change', () => {
    render(<CreateStory />);

    // Simulate title change
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Title' } });
    expect((useStoryForm as jest.Mock).mock.results[0].value.handleTitleChange).toHaveBeenCalledWith('New Title');

    // Simulate description change
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'New Description' } });
    expect((useStoryForm as jest.Mock).mock.results[0].value.handleDescriptionChange).toHaveBeenCalledWith('New Description');
  });

  it('calls saveStory and handles navigation on successful save', async () => {
    const mockStoryResponse = { success: true, id: '123' };
    (saveStory as jest.Mock).mockResolvedValue(mockStoryResponse);
    (uploadCoverImage as jest.Mock).mockResolvedValue({});
    (addChapterToStory as jest.Mock).mockResolvedValue({});

    render(<CreateStory />);

    // Simulate the save action
    fireEvent.click(screen.getByText(/Save/i)); // Adjust this based on the actual button text

    await waitFor(() => {
      expect(saveStory).toHaveBeenCalledWith({
        title: 'Test Title',
        modelName: 'Test Model',
        chapters: [],
        categories: ['Category1'],
        description: 'Test Description',
        id: '',
        coverUrl: 'http://example.com/cover.jpg',
        color: '#ffffff'
      });
      expect(uploadCoverImage).toHaveBeenCalledWith('123', null);
      expect(addChapterToStory).toHaveBeenCalledWith('123', 0);
      expect(mockPush).toHaveBeenCalledWith('/edit/123');
    });
  });

  it('handles errors in saveStory', async () => {
    (saveStory as jest.Mock).mockRejectedValue(new Error('Failed to save story'));

    render(<CreateStory />);

    // Simulate the save action
    fireEvent.click(screen.getByText(/Save/i)); // Adjust this based on the actual button text

    await waitFor(() => {
      expect(saveStory).toHaveBeenCalled();
      expect(screen.getByText(/Error saving story:/i)).toBeInTheDocument();
    });
  });

  it('calls handleCancel when cancel button is clicked', () => {
    render(<CreateStory />);

    // Simulate the cancel action
    fireEvent.click(screen.getByText(/Cancel/i)); // Adjust this based on the actual button text
    expect((useStoryForm as jest.Mock).mock.results[0].value.handleCancel).toHaveBeenCalled();
  });

  it('uploads cover image if cover file is present', async () => {
    (useStoryForm as jest.Mock).mockReturnValueOnce({
      ... (useStoryForm as jest.Mock).mock.results[0].value,
      coverFile: new File(['dummy content'], 'cover.jpg', { type: 'image/jpeg' })
    });

    const mockStoryResponse = { success: true, id: '123' };
    (saveStory as jest.Mock).mockResolvedValue(mockStoryResponse);
    (uploadCoverImage as jest.Mock).mockResolvedValue({});
    (addChapterToStory as jest.Mock).mockResolvedValue({});

    render(<CreateStory />);

    // Simulate the save action
    fireEvent.click(screen.getByText(/Save/i)); // Adjust this based on the actual button text

    await waitFor(() => {
      expect(uploadCoverImage).toHaveBeenCalledWith('123', expect.any(File));
    });
  });
});
