import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BreweryCard from '../BreweryCard';
import { useUserContext } from '@/app/store/userContext';

jest.mock('@/app/store/userContext', () => ({
  useUserContext: jest.fn()
}));

jest.mock('phosphor-react', () => ({
  Phone: () => <div data-testid="phone-icon" />,
  PlusCircle: () => <div data-testid="plus-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
  MapPin: () => <div data-testid="map-icon" />,
  ChartBar: () => <div data-testid="chart-icon" />
}));

describe('BreweryCard', () => {
  const mockAddFavorite = jest.fn();
  const mockRemoveFavorite = jest.fn();
  
  const mockBrewery = {
    id: '123',
    name: 'Test Brewery',
    brewery_type: 'micro',
    address_1: '123 Main St',
    address_2: null,
    address_3: null,
    city: 'Test City',
    state_province: 'Test State',
    postal_code: '12345',
    country: 'Test Country',
    longitude: 123.456,
    latitude: 78.910,
    phone: '555-1234',
    website_url: 'https://test.com',
    state: 'Test State',
    street: '123 Main St'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue({
      addFavoriteBrewery: mockAddFavorite,
      removeFavoriteBrewery: mockRemoveFavorite
    });
  });
  
  test('renders brewery information correctly', () => {
    render(<BreweryCard brewery={mockBrewery} />);
    
    expect(screen.getByText('Test Brewery')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Test City, Test State - Test Country')).toBeInTheDocument();
    expect(screen.getByText('MICRO')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });
  
  test('displays add button when not favorite', () => {
    render(<BreweryCard brewery={mockBrewery} isFavorite={false} />);
    
    const addButton = screen.getByRole('button', { name: /add to favorites/i });
    expect(addButton).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
  });
  
  test('displays remove button when favorite', () => {
    render(<BreweryCard brewery={mockBrewery} isFavorite={true} />);
    
    const removeButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(removeButton).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
  });
  
  test('calls addFavoriteBrewery when add button is clicked', () => {
    render(<BreweryCard brewery={mockBrewery} isFavorite={false} />);
    
    const addButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(addButton);
    
    expect(mockAddFavorite).toHaveBeenCalledTimes(1);
    expect(mockAddFavorite).toHaveBeenCalledWith(mockBrewery);
  });
  
  test('calls removeFavoriteBrewery when remove button is clicked', () => {
    render(<BreweryCard brewery={mockBrewery} isFavorite={true} />);
    
    const removeButton = screen.getByRole('button', { name: /remove from favorites/i });
    fireEvent.click(removeButton);
    
    expect(mockRemoveFavorite).toHaveBeenCalledTimes(1);
    expect(mockRemoveFavorite).toHaveBeenCalledWith('123');
  });
  
  test('does not display brewery type tag when type is missing', () => {
    const breweryWithoutType = { ...mockBrewery, brewery_type: '' };
    render(<BreweryCard brewery={breweryWithoutType} />);
    
    expect(screen.queryByText('MICRO')).not.toBeInTheDocument();
  });
  
  test('does not display postal code tag when postal code is missing', () => {
    const breweryWithoutPostal = { ...mockBrewery, postal_code: '' };
    render(<BreweryCard brewery={breweryWithoutPostal} />);
    
    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });
  
  test('does not display phone when phone is missing', () => {
    const breweryWithoutPhone = { ...mockBrewery, phone: null };
    render(<BreweryCard brewery={breweryWithoutPhone} />);
    
    expect(screen.queryByText('555-1234')).not.toBeInTheDocument();
    expect(screen.queryByTestId('phone-icon')).not.toBeInTheDocument();
  });
});