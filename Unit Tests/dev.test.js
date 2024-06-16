import { roundNum } from "../client/src/components/TasksBox/Tasks"
import { calculatePriorityPoints } from "../client/src/components/TasksBox/Tasks"
import { PriorityQueue } from "../client/src/Data Structures/minPriorityQueue"

// Unit Testing for roundNum function
// test('tests rounding of a non-negative number', () => {
//     expect(roundNum(1.5)).toBe(2)
// })

// test('tests rounding of a non-negative number', () => {
//     expect(roundNum(2)).toBe(2)
// })

// test('tests rounding of a non-negative number', () => {
//     expect(roundNum(1.1)).toBe(1)
// })

// test('tests rounding of a non-negative number', () => {
//     expect(roundNum(19.4)).toBe(19)
// })

// test('tests rounding of a non-negative number', () => {
//     expect(roundNum(22.9)).toBe(23)
// })

// // Unit Testing Calculation of Priority Points.
// test('tests calculating priority points.', () => {
//     expect(calculatePriorityPoints('High', 12)).toBe(4)
// })

// test('tests calculating priority points.', () => {
//     expect(calculatePriorityPoints('High', 62)).toBe(6)
// })

// test('tests calculating priority points.', () => {
//     expect(calculatePriorityPoints('Low', 2)).toBe(1)
// })

// test('tests calculating priority points.', () => {
//     expect(calculatePriorityPoints('Low', 20)).toBe(2)
// })

// test('tests calculating priority points.', () => {
//     expect(calculatePriorityPoints('Medium', 0)).toBe(2)
// })

// test('tests calculating priority points.', () => {
//     expect(calculatePriorityPoints('Medium', 90)).toBe(6)
// })

let pq = new PriorityQueue()
pq.pushItem(1,2)
pq.pushItem(1,2)
pq.pushItem(2,0)
pq.pushItem(1,0)
test('tests the new pq', () => {
    expect(pq.queue).toEqual([{key: 1, priority: 2}])
})

test('tests the new pq size of 1', () => {
    expect(pq.size()).toEqual(1)
})

test('tests the pushing a second item', () => {
    expect(pq.queue).toEqual([{key: 1, priority: 2}, {key: 1, priority: 2}])
})

test('tests the new pq size of 2', () => {
    expect(pq.size()).toEqual(2)
})

test('tests the new pq', () => {
    expect(pq.queue).toEqual([{key: 2, priority: 0}, {key: 4, priority: 1}, {key: 1, priority: 2}])
})

test('tests the new pq size of 3', () => {
    expect(pq.size()).toEqual(3)
})

test('tests the new pq', () => {
    expect(pq.queue).toEqual([{key: 1, priority: 0}, {key: 2, priority: 0}, {key: 4, priority: 1}, {key: 1, priority: 2}])
})

test('tests the new pq size of 4', () => {
    expect(pq.size()).toEqual(4)
})



