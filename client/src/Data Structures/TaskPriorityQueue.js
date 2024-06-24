export class TaskPriorityQueue {
    // Max Heap
    constructor() {
        this.queue = []
        this.priorityMap = {
            High: 3,
            Medium: 2,
            Low: 1
        }
    }

    isEmpty() {
        return this.queue.length == 0
    }

    size() {
        return this.queue.length
    }

    pushItem(task, priority) {
        let pushed = false
        const priorityLevel = this.priorityMap[priority]

        for (let i = 0; i < this.queue.length; i++) {
            const currPriorityLevel = this.priorityMap[this.queue[i].priority]
            if (priorityLevel > currPriorityLevel) {
                this.queue = [...this.queue.slice(0, i), {task, priority}, ...this.queue.slice(i)]
                pushed = true
                break
            }
        }
        if (!pushed) {
            this.queue.push({task, priority})
        }
    }

    popMax() {
        const maxValue = this.queue.shift()
        return maxValue ? maxValue : -1
    }

}