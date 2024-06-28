import { render, screen } from "@testing-library/react"
import Tasks from "../../src/components/TasksBox/Tasks.jsx"

it("Should display tasks", async () => {
    const mockTask = {
        taskId: 1,
        title: 'Sample Task',
        deadline: '2025-08-03T00:00:00.000Z',
        priority: 'High',
        category: 'Work'
    };

    render(
        <Tasks
            taskId={mockTask.taskId}
            title={mockTask.title}
            deadline={mockTask.deadline}
            priority={mockTask.priority}
            category={mockTask.category}
        />
    );

    expect(screen.findByText('Sample Task')).toBeTruthy();
    expect(screen.getByText('03/08')).toBeTruthy();
    expect(screen.getByText('High | Work')).toBeTruthy();
    expect()
});

