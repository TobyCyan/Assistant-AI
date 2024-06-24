import { checkStrongPW } from "../client/src/pages/SignUp"

// Unit Tests to test for Strong Password Checker.
const pw1 = '123456789'
const pw2 = 'es2549'
const pw3 = 'H123sw'
const pw4 = 'H123sw5GQa'
const pw5 = '159756jkQ'
const pw6 = '9lqsncO'

test('tests the strong pw checker 1', () => {
    expect(checkStrongPW(pw1)).toEqual(false)
})

test('tests the strong pw checker 2', () => {
    expect(checkStrongPW(pw2)).toEqual(false)
})

test('tests the strong pw checker 3', () => {
    expect(checkStrongPW(pw3)).toEqual(false)
})

test('tests the strong pw checker 4', () => {
    expect(checkStrongPW(pw4)).toEqual(true)
})

test('tests the strong pw checker 5', () => {
    expect(checkStrongPW(pw5)).toEqual(true)
})

test('tests the strong pw checker 6', () => {
    expect(checkStrongPW(pw6)).toEqual(false)
})