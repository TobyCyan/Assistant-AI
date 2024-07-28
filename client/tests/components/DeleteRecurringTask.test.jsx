import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {TokenProvider} from "../../src/components/TokenContext/TokenContext.jsx";
import DeleteRecurringTask from '../../src/components/TaskModals/DeleteRecurringTask.jsx'; // Adjust the path as per your file structure

describe('DeleteRecurringTask', () => {
    it('renders Delete mode correctly', () => {
        const mockOnClose = vi.fn();
        const mockGetTask = vi.fn();

        render(<DeleteRecurringTask
            recurringTask={{title: 'Test Task'}}
            onClose={mockOnClose}
            getAllTasks={mockGetTask}
        />, {
            wrapper: TokenProvider,
        });

        expect(screen.getByText(/Are you sure you want to delete recurring task "Test Task"?/)).toBeInTheDocument();
    });
})