export class PriorityQueue {
    // Min Heap
    constructor() {
        this.queue = []
    }

    isEmpty() {
        return this.queue.length == 0
    }

    size() {
        return this.queue.length
    }

    pushItem(key, priority) {
        let pushed = false
        
        for (let i = 0; i < this.queue.length; i++) {
            if (priority <= this.queue[i].priority) {
                this.queue = [...this.queue.slice(0, i), {key, priority}, ...this.queue.slice(i)]
                pushed = true
                break
            }
        }
        if (!pushed) {
            this.queue.push({key: key, priority: priority})
        }
    }

    popMin() {
        const minValue = this.queue.shift()
        return minValue ? minValue : -1
    }

}