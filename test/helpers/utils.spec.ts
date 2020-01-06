import { isNull, isUndefined, isDate, isPlainObject, isString } from '../../src/helpers/utils'

describe('helpers:utils', () => {
  describe('isXX', () => {
    test('should null', () => {
      expect(isNull(null)).toBeTruthy()
      expect(isNull(undefined)).toBeFalsy()
      expect(isNull(0)).toBeFalsy()
      expect(isNull('')).toBeFalsy()
      expect(isNull('null')).toBeFalsy()
    })

    test('should undefined', () => {
      expect(isUndefined(undefined)).toBeTruthy()
      expect(isUndefined(null)).toBeFalsy()
      expect(isUndefined(0)).toBeFalsy()
      expect(isUndefined('')).toBeFalsy()
      expect(isUndefined('undefined')).toBeFalsy()
    })

    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
      expect(isDate('2019/12/12')).toBeFalsy()
    })

    test('should validate plainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(null)).toBeFalsy()
      expect(isPlainObject(function() {})).toBeFalsy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })

    test('should string', () => {
      expect(isString('')).toBeTruthy()
      expect(isString(1)).toBeFalsy()
      expect(isString(new Date())).toBeFalsy()
    })
  })
})
