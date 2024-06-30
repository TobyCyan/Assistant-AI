export class TaskPriorityQueue {
    /**
     * Constructor of the Priority Queue.
     * @constructor
     */
    constructor() {
        this.queue = []
        this.priorityMap = {
            High: 3,
            Medium: 2,
            Low: 1
        }
    }

    /**
     * Checks whether queue is empty.
     * @returns {boolean} true or false.
     */
    isEmpty() {
        return this.queue.length == 0
    }

    /**
     * Returns the size of the queue.
     * @returns {number} The length of the queue.
     */
    size() {
        return this.queue.length
    }

    /**
     * 
     * @param {Object} task The user task.
     * @param {string} priority The priority of the task - High, Medium, Low.
     */
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

    /**
     * Pops the max task priority pair from the priority queue.
     * @returns {{task: Object, priority: string}} task priority pair with the highest priority. 
     */
    popMax() {
        const maxValue = this.queue.shift()
        return maxValue ? maxValue : -1
    }

}