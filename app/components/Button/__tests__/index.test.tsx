import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import * as useButtonModule from '../hooks/useButton';

jest.mock('../hooks/useButton', () => ({
  useButton: jest.fn()
}));

describe('Button', () => {
  const mockGetButtonColor = jest.fn().mockReturnValue('bg-black text-primary-yellow');
  const mockGetButtonSize = jest.fn().mockReturnValue('p-3');
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useButtonModule.useButton as jest.Mock).mockReturnValue({
      getButtonColor: mockGetButtonColor,
      getButtonSize: mockGetButtonSize
    });
  });
  
  test('renders button with text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('renders button with children', () => {
    render(
      <Button>
        <span data-testid="child-element">Child Element</span>
      </Button>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
  
  test('calls onClick when button is clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('button is disabled when disabled prop is true', () => {
    render(<Button text="Disabled Button" disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  test('passes type prop to useButton hook', () => {
    render(<Button text="Primary Button" type="PRIMARY" />);
    expect(useButtonModule.useButton).toHaveBeenCalledWith('PRIMARY', 'MEDIUM');
  });
  
  test('passes size prop to useButton hook', () => {
    render(<Button text="Small Button" size="SMALL" />);
    expect(useButtonModule.useButton).toHaveBeenCalledWith('PRIMARY', 'SMALL');
  });
  
  test('applies getButtonColor and getButtonSize classes', () => {
    mockGetButtonColor.mockReturnValue('custom-color-class');
    mockGetButtonSize.mockReturnValue('custom-size-class');
    
    render(<Button text="Custom Button" />);
    const buttonElement = screen.getByRole('button');
    
    expect(buttonElement).toHaveClass('custom-color-class');
    expect(buttonElement).toHaveClass('custom-size-class');
  });
  
  test('applies extraClass when provided', () => {
    render(<Button text="Extra Class Button" extraClass="extra-test-class" />);
    expect(screen.getByRole('button')).toHaveClass('extra-test-class');
  });
  
  test('renders with correct button type when typeButton is provided', () => {
    render(<Button text="Submit Button" typeButton="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
  
  test('renders with button type="button" by default', () => {
    render(<Button text="Default Button" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
  
  test('uses PRIMARY type by default', () => {
    render(<Button text="Default Type Button" />);
    expect(useButtonModule.useButton).toHaveBeenCalledWith('PRIMARY', 'MEDIUM');
  });
  
  test('uses MEDIUM size by default', () => {
    render(<Button text="Default Size Button" />);
    expect(useButtonModule.useButton).toHaveBeenCalledWith('PRIMARY', 'MEDIUM');
  });
});