import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {TokenProvider} from "../../src/components/TokenContext/TokenContext.jsx";
import CompleteDeleteTasks from '../../src/components/TaskModals/CompleteDeleteTasks.jsx'; // Adjust the path as per your file structure

describe('CompleteDeleteTasks', () => {
    it('renders Delete mode correctly', () => {
        const mockOnClose = vi.fn();
        const mockHandleConfirm = vi.fn();

        render(<CompleteDeleteTasks
            taskData={{title: 'Test Task'}}
            type="del"
            onClose={mockOnClose}
            handleConfirm={mockHandleConfirm}
        />, {
            wrapper: TokenProvider,
        });

        // Assert that the component renders correctly in Add mode

        expect(screen.getByText(/Are you sure you want to delete this task "Test Task"?/)).toBeInTheDocument();
    });

    it('renders Delete mode correctly', () => {
        const mockOnClose = vi.fn();
        const mockHandleConfirm = vi.fn();

        render(<CompleteDeleteTasks
            taskData={{title: 'Test Task'}}
            type="comp"
            onClose={mockOnClose}
            handleConfirm={mockHandleConfirm}
        />, {
            wrapper: TokenProvider,
        });

        expect(screen.getByText(/Are you sure you want to complete this task "Test Task"?/)).toBeInTheDocument();
        fireEvent.click(screen.getByText('COMPLETE')); // Adjust text based on your button content
    });

    it('renders Uncomplete mode correctly', () => {
        const mockOnClose = vi.fn();
        const mockHandleConfirm = vi.fn();

        render(<CompleteDeleteTasks
            taskData={{title: 'Test Task'}}
            type="uncomp"
            onClose={mockOnClose}
            handleConfirm={mockHandleConfirm}
        />, {
            wrapper: TokenProvider,
        });

        expect(screen.getByText(/Are you sure you want to uncomplete this task "Test Task"?/)).toBeInTheDocument();
        fireEvent.click(screen.getByText('UNCOMPLETE')); // Adjust text based on your button content
    });
})