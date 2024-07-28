import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest';
import TasksBox from '../../src/components/TasksCardsAndBox/TasksBox.jsx';

describe('TasksCardsAndBox Component', () => {
    const mockTasks = [
        { id: 1, title: 'Task 1', deadline: '2023-07-01', priority: 'High', category: 'Work' },
        { id: 2, title: 'Task 2', deadline: '2023-07-02', priority: 'Medium', category: 'Personal' },
    ];

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnComplete = vi.fn();

    // Check top display
    it('renders the title with the correct count of tasks', () => {
        render(<TasksBox title="My Tasks" tasksToShow={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} onComplete={mockOnComplete} />);
        expect(screen.getByText('My Tasks (2)')).toBeInTheDocument();
    });

    // Check if tasks are shown properly
    it('renders the list of tasks', () => {
        render(<TasksBox title="My Tasks" tasksToShow={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} onComplete={mockOnComplete} />);
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    // Check edit button
    it('calls the onEdit function when the edit button is clicked', () => {
        render(<TasksBox title="My Tasks" tasksToShow={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} onComplete={mockOnComplete} />);
        fireEvent.click(screen.getAllByTestId('editButton')[0]);
        expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0]);
    });

    // Check complete button
    it('calls the onComplete function when the complete button is clicked', () => {
        const { container } = render(
            <TasksBox
                title="My Tasks"
                tasksToShow={mockTasks}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComplete={mockOnComplete}
            />
        );

        const completeButtons = container.querySelectorAll('.taskTickButton');
        fireEvent.click(completeButtons[0]);
        expect(mockOnComplete).toHaveBeenCalledWith(mockTasks[0]);
    });

    // Check delete button
    it('calls the onDelete function when the delete button is clicked', () => {
        const { container } = render(
            <TasksBox
                title="My Tasks"
                tasksToShow={mockTasks}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onComplete={mockOnComplete}
            />
        );

        const deleteButtons = container.querySelectorAll('.taskCrossButton');
        fireEvent.click(deleteButtons[0]);
        expect(mockOnComplete).toHaveBeenCalledWith(mockTasks[0]);
    });
});
