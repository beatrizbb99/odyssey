import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shelf from '@/pages/category/shelf'; // Pfad zur Shelf-Seite
import { useRouter } from 'next/router';

// Mock necessary modules
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/Scene', () => () => <div>Scene Component</div>);

describe('<Shelf>', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders Shelf component with expected elements', () => {
    render(<Shelf />);

    // Check if the main elements are rendered
    expect(screen.getByText('Wähle eine Kategorie aus dem Regal')).toBeInTheDocument();
    expect(screen.getByText('Zurück zum Anfang')).toBeInTheDocument();
    expect(screen.getByText('Erstelle eine Geschichte!')).toBeInTheDocument();
    expect(screen.getByText('Alle Geschichten')).toBeInTheDocument();
    expect(screen.getByText('Scene Component')).toBeInTheDocument();
  });

  it('navigates to the home page when "Zurück zum Anfang" button is clicked', () => {
    render(<Shelf />);

    // Simulate button click
    fireEvent.click(screen.getByText('Zurück zum Anfang'));

    // Verify that router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigates to the new story page when "Erstelle eine Geschichte!" button is clicked', () => {
    render(<Shelf />);

    // Simulate button click
    fireEvent.click(screen.getByText('Erstelle eine Geschichte!'));

    // Verify that router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/story/new');
  });

  it('navigates to all stories page when "Alle Geschichten" button is clicked', () => {
    render(<Shelf />);

    // Simulate button click
    fireEvent.click(screen.getByText('Alle Geschichten'));

    // Verify that router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/story');
  });
});
