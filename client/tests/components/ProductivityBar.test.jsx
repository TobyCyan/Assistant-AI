import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductivityBar from '../../src/components/ProductivityBar/ProductivityBar.jsx'

describe('ProductivityBar Component', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render(<ProductivityBar percentage={50} />);
        const barElement = getByTestId('productivity-bar');
        expect(barElement).toBeInTheDocument();
    });

    it('displays the correct width based on the percentage prop', () => {
        const { getByTestId } = render(<ProductivityBar percentage={75} />);
        const progressElement = getByTestId('productivity');
        expect(progressElement).toHaveStyle('width: 75%');
    });

    it('handles 0% productivity', () => {
        const { getByTestId } = render(<ProductivityBar percentage={0} />);
        const progressElement = getByTestId('productivity');
        expect(progressElement).toHaveStyle('width: 0%');
    });

    it('handles negative% productivity', () => {
        const { getByTestId } = render(<ProductivityBar percentage={-5} />);
        const progressElement = getByTestId('productivity');
        expect(progressElement).toHaveStyle('width: 0%');
    });

    it('handles 100% productivity', () => {
        const { getByTestId } = render(<ProductivityBar percentage={100} />);
        const progressElement = getByTestId('productivity');
        expect(progressElement).toHaveStyle('width: 100%');
    });

    it('handles >100% productivity', () => {
        const { getByTestId } = render(<ProductivityBar percentage={105} />);
        const progressElement = getByTestId('productivity');
        expect(progressElement).toHaveStyle('width: 100%');
    });
});
