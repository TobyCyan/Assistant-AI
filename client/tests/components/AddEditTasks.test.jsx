import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {TokenProvider} from "../../src/components/TokenContext/TokenContext.jsx";
import AddEditTasks from '../../src/components/TaskModals/AddEditTasks.jsx'; // Adjust the path as per your file structure

describe('AddEditTasks Component', () => {
    //const mockGetTasks = vi.fn()
    //const mockOnClose = vi.fn()

    it('renders Add mode correctly', () => {
        render(<AddEditTasks/>, {
            wrapper: TokenProvider,
        });

        // Assert that the component renders correctly in Add mode

        const titleInput = screen.getByLabelText('Title');
        expect(titleInput).toBeInTheDocument()
        expect(titleInput).toHaveValue('');

        const descriptionInput = screen.getByLabelText('Description');
        expect(descriptionInput).toBeInTheDocument()
        expect(descriptionInput).toHaveValue('');

        const categoryInput = screen.getByLabelText('Category');
        expect(categoryInput).toBeInTheDocument()
        expect(categoryInput).toHaveValue('');

        const priorityInput = screen.getByLabelText('Priority');
        expect(priorityInput).toBeInTheDocument()
        expect(priorityInput).toHaveValue('');

        const deadlineInput = screen.getByLabelText('Deadline:');
        expect(deadlineInput).toBeInTheDocument()
        expect(deadlineInput).toHaveValue('');

        const reminderInput = screen.getByLabelText('Reminder Date:');
        expect(reminderInput).toBeInTheDocument()
        expect(reminderInput).toHaveValue('');

        const addButton = screen.getByText('ADD')
        expect(addButton).toBeInTheDocument();

        //fireEvent.click(addButton);
        //expect(mockGetTasks).toHaveBeenCalledTimes(1);
        //expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('renders Edit mode correctly', () => {

        const mockTaskData = {
            id: '3',
            title: 'Mock Task',
            description: 'Mock Description',
            category: 'Mock Category',
            deadline: '2025-09-09',
            priority: 'Medium',
            reminder: '2025-07-08',
            completed: false,
            points: 0,
        };

        render(<AddEditTasks
            taskData={mockTaskData}
            type="edit"
            getAllTasks={() => {}}
            onClose={() => {}}
        />, {
            wrapper: TokenProvider,
        });

        // Assert that the component renders correctly in Add mode

        const titleInput = screen.getByLabelText('Title');
        expect(titleInput).toBeInTheDocument()
        expect(titleInput).toHaveValue('Mock Task');

        const descriptionInput = screen.getByLabelText('Description');
        expect(descriptionInput).toBeInTheDocument()
        expect(descriptionInput).toHaveValue('Mock Description');

        const categoryInput = screen.getByLabelText('Category');
        expect(categoryInput).toBeInTheDocument()
        expect(categoryInput).toHaveValue('Mock Category');

        const priorityInput = screen.getByLabelText('Priority');
        expect(priorityInput).toBeInTheDocument()
        expect(priorityInput).toHaveValue('Medium');

        const deadlineInput = screen.getByLabelText('Deadline:');
        expect(deadlineInput).toBeInTheDocument()
        expect(deadlineInput).toHaveValue('2025-09-09');

        const reminderInput = screen.getByLabelText('Reminder Date:');
        expect(reminderInput).toBeInTheDocument()
        expect(reminderInput).toHaveValue('2025-07-08');

        expect(screen.getByText('UPDATE')).toBeInTheDocument();
    });

    /*
    it('handles form submission correctly', async () => {
        const mockCloseFunction = vi.fn();
        const mockGetAllTasksFunction = vi.fn();

        render(<AddEditTasks
            taskData={{}}
            type="add"
            getAllTasks={mockGetAllTasksFunction}
            onClose={mockCloseFunction}
        />, {
            wrapper: TokenProvider,
        });

        // Mock user input
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task Title' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Task Description' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'New Category' } });
        fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } });
        fireEvent.change(screen.getByLabelText('Deadline:'), { target: { value: '2024-07-10' } });
        fireEvent.change(screen.getByLabelText('Reminder Date:'), { target: { value: '2024-07-09' } });

        // Mock API fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ taskId: 'mockTaskId' }),
            })
        );

        // Click the submit button
        fireEvent.click(screen.getByText('ADD'));

        // Verify that functions were called
        expect(mockGetAllTasksFunction).toHaveBeenCalled();
        expect(mockCloseFunction).toHaveBeenCalled();
    });
    */
});

