import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import DetailedTaskCard from '../../src/components/Tasks/DetailedTaskCard.jsx';


describe('DetailedTaskCard Component', () => {
    const mockTaskData = {
        title: 'Sample Task',
        deadline: '2025-08-03T00:00:00.000Z',
        category: 'Work',
        priority: 'High',
        description: 'This is a sample task description.',
        reminder: '2025-07-30T00:00:00.000Z',
        completed: false
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnComplete = vi.fn();
    const mockOnUncomplete = vi.fn();

    beforeEach(() => {
        render(
            <DetailedTaskCard
                taskData={mockTaskData}
                onEdit={mockOnEdit}
                onComplete={mockOnComplete}
                onUncomplete={mockOnUncomplete}
                onDelete={mockOnDelete}
            />
        );
    });

    it('renders the task details correctly', () => {
        expect(screen.getByText('Sample Task')).toBeInTheDocument();
        expect(screen.getByText('03/08/25')).toBeInTheDocument();
        expect(screen.getByText('Work')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('This is a sample task description.')).toBeInTheDocument();
        expect(screen.getByText('30/07')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', () => {
        fireEvent.click(screen.getByText('Edit'));
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete when delete button is clicked', () => {
        fireEvent.click(screen.getByText('X'));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('calls onComplete when complete button is clicked', () => {
        fireEvent.click(screen.getByText('Complete'));
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('displays "Uncomplete" when task is completed and calls onUncomplete when clicked', () => {
        render(
            <DetailedTaskCard
                taskData={{ ...mockTaskData, completed: true }}
                onEdit={mockOnEdit}
                onComplete={mockOnComplete}
                onUncomplete={mockOnUncomplete}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText('Uncomplete')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Uncomplete'));
        expect(mockOnUncomplete).toHaveBeenCalledTimes(1);
    });
});