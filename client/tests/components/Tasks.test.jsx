import { render, screen } from "@testing-library/react"
import Tasks from "../../src/components/TasksCardsAndBox/Tasks.jsx"
import { vi } from 'vitest'
it("Should display tasks", async () => {
    const mockTask = {
        taskId: 1,
        title: 'Sample Task',
        deadline: '2025-08-03T00:00:00.000Z',
        priority: 'High',
        category: 'Work'
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnComplete = vi.fn();

    render(
        <Tasks
            taskId={mockTask.taskId}
            title={mockTask.title}
            deadline={mockTask.deadline}
            priority={mockTask.priority}
            category={mockTask.category}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onComplete={mockOnComplete}
        />
    );

    expect(screen.findByText('Sample Task')).toBeTruthy();
    expect(screen.getByText('03/08')).toBeTruthy();
    expect(screen.getByText('High | Work')).toBeTruthy();
});

