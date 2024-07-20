import { randomItem } from "../client/src/utilities/utilities";
const { toBeOneOf } = require('jest-extended')

expect.extend({ toBeOneOf })
test('tests getting a random item from the given array 1', () => {
    expect(randomItem([1, 2, 3, 4])).toBeOneOf([1, 2, 3, 4])
})

test('tests getting a random item from the given array 2', () => {
    expect(randomItem([1])).toBeOneOf([1])
})

test('tests getting a random item from the given array 2', () => {
    expect(randomItem([1, 2])).toBeOneOf([1, 2])
})

test('tests getting a random item from the given array of different types 1', () => {
    expect(randomItem([1, 2, 3, 4, 5.6, 'item'])).toBeOneOf([1, 2, 3, 4, 5.6, 'item'])
})