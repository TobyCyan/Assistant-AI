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
        fireEvent.click(screen.getByText('DELETE')); // Adjust text based on your button content

        // Assert that handleConfirm function was called
        // expect(mockHandleConfirm).toHaveBeenCalled();

        // Simulate user clicking the close button
        // fireEvent.click(screen.getByText('Close')); // Adjust text based on your close button content

        // Assert that onClose function was called
        // expect(mockOnClose).toHaveBeenCalled();
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

        // Assert that the component renders correctly in Add mode

        expect(screen.getByText(/Are you sure you want to complete this task "Test Task"?/)).toBeInTheDocument();
        fireEvent.click(screen.getByText('COMPLETE')); // Adjust text based on your button content

        // Assert that handleConfirm function was called
        // expect(mockHandleConfirm).toHaveBeenCalled();

        // Simulate user clicking the close button
        // fireEvent.click(screen.getByText('Close')); // Adjust text based on your close button content

        // Assert that onClose function was called
        // expect(mockOnClose).toHaveBeenCalled();
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

        // Assert that the component renders correctly in Add mode

        expect(screen.getByText(/Are you sure you want to uncomplete this task "Test Task"?/)).toBeInTheDocument();
        fireEvent.click(screen.getByText('UNCOMPLETE')); // Adjust text based on your button content

        // Assert that handleConfirm function was called
        // expect(mockHandleConfirm).toHaveBeenCalled();

        // Simulate user clicking the close button
        // fireEvent.click(screen.getByText('Close')); // Adjust text based on your close button content

        // Assert that onClose function was called
        // expect(mockOnClose).toHaveBeenCalled();
    });
})