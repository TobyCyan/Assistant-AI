import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {TokenProvider} from "../../src/components/TokenContext/TokenContext.jsx";
import ExchangeItemsModal from '../../src/components/Shop/ExchangeItemsModal.jsx'; // Adjust the path as per your file structure

describe('ExchangeItemsModal', () => {
    it('renders Exchange Items correctly', () => {
        const mockItem = {
            title: 'Sample',
            points: 30,
        }

        render(<ExchangeItemsModal
            itemData={mockItem}
        />, {
            wrapper: TokenProvider,
        });

        expect(screen.getByText(/Exchange 30 points for Sample"?/)).toBeInTheDocument();
    });
});