import { roundNum } from "../client/src/components/TasksBox/Tasks"

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