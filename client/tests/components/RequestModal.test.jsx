import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {TokenProvider} from "../../src/components/TokenContext/TokenContext.jsx";
import RequestModal from '../../src/components/ProfilePage/RequestModal.jsx';

describe('DeleteRecurringTask', () => {
    it('renders Accept Friend Request correctly', () => {

        const mockRequest = {
            name: "Sender"
        }

        render(<RequestModal
            request={mockRequest}
            type="accept"
        />, {
            wrapper: TokenProvider,
        });

        expect(screen.getByText(/Accept Sender's friend request?"?/)).toBeInTheDocument();
    });

    it('renders Accept Friend Request correctly', () => {

        const mockRequest = {
            name: "Sender"
        }

        render(<RequestModal
            request={mockRequest}
            type="delete"
        />, {
            wrapper: TokenProvider,
        });

        expect(screen.getByText(/Reject Sender's friend request?"?/)).toBeInTheDocument();
    });
})

