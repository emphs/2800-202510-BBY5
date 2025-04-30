import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    test('renders initial count', () => {
        render(<App />);
        expect(screen.getByText('count is: 0')).toBeInTheDocument();
    });

    test('increments count when button is clicked', async () => {
        render(<App />);
        const incrementButton = screen.getByRole('button', { name: 'increment' });
        fireEvent.click(incrementButton);
        expect(screen.getByText('count is: 1')).toBeInTheDocument();
    });
});