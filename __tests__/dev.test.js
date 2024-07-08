import { roundNum } from "../client/src/components/TasksCardsAndBox/Tasks"
import { calculatePriorityPoints } from "../client/src/components/TasksCardsAndBox/Tasks"
import { TaskPriorityQueue } from "../client/src/Data Structures/TaskPriorityQueue"

// Unit Testing for roundNum function
test('tests rounding of a non-negative number', () => {
    expect(roundNum(1.5)).toBe(2)
})

test('tests rounding of a non-negative number', () => {
    expect(roundNum(2)).toBe(2)
})

test('tests rounding of a non-negative number', () => {
    expect(roundNum(1.1)).toBe(1)
})

test('tests rounding of a non-negative number', () => {
    expect(roundNum(19.4)).toBe(19)
})

test('tests rounding of a non-negative number', () => {
    expect(roundNum(22.9)).toBe(23)
})

// Unit Testing Calculation of Priority Points.
test('tests calculating priority points.', () => {
    expect(calculatePriorityPoints('High', 12)).toBe(4)
})

test('tests calculating priority points.', () => {
    expect(calculatePriorityPoints('High', 62)).toBe(6)
})

test('tests calculating priority points.', () => {
    expect(calculatePriorityPoints('Low', 2)).toBe(1)
})

test('tests calculating priority points.', () => {
    expect(calculatePriorityPoints('Low', 20)).toBe(2)
})

test('tests calculating priority points.', () => {
    expect(calculatePriorityPoints('Medium', 0)).toBe(2)
})

test('tests calculating priority points.', () => {
    expect(calculatePriorityPoints('Medium', 90)).toBe(6)
})

// let pq = new TaskPriorityQueue()
// pq.pushItem(1,'High')
// pq.pushItem(4, 'Low')
// pq.pushItem(2, 'Medium')
// pq.pushItem(0, 'High')

// test('tests the new pq', () => {
//     expect(pq.queue).toEqual([
//         {task: 1, priority: 'High'},
//         {task: 0, priority: 'High'}, 
//         {task: 2, priority: 'Medium'}, 
//         {task: 4, priority: 'Low'},
//     ])
// })

// test('tests the new pq size', () => {
//     expect(pq.size()).toEqual(4)
// })

// test('tests the new pq popMax', () => {
//     expect(pq.popMax()).toEqual({task: 1, priority: 'High'})
// })

// test('tests the new pq after popMax', () => {
//     expect(pq.queue).toEqual([
//         {task: 0, priority: 'High'}, 
//         {task: 2, priority: 'Medium'}, 
//         {task: 4, priority: 'Low'},
//     ])
// })




