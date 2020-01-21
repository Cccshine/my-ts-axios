import {
  isNull,
  isUndefined,
  isDate,
  isPlainObject,
  isString,
  extend,
  $extend,
  deepMerge,
  isFormData,
  isURLSearchParams
} from '../../src/helpers/utils'

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

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }

      extend(a, b)

      expect(a.foo).toBe(123)
    })

    test('should extend properties', function() {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }

      deepMerge(a, b, c)

      expect(a.foo).toBeUndefined()
      expect(a.bar).toBeUndefined()
      expect(b.foo).toBe(123)
      expect(b.bar).toBeUndefined()
      expect(c.foo).toBeUndefined()
      expect(c.bar).toBe(456)
    })

    test('should deepMerge properties', () => {
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })

    test('should deepMerge recursively', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      })
    })

    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123
        }
      })
      expect(c.foo).not.toBe(a.foo)
    })

    test('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { a: 123 })).toEqual({ a: 123 })
      expect(deepMerge({ a: 123 }, undefined)).toEqual({ a: 123 })
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { a: 123 })).toEqual({ a: 123 })
      expect(deepMerge({ a: 123 }, null)).toEqual({ a: 123 })
    })
  })

  describe('$extend', () => {
    test('shuold extend simple type value', () => {
      const obj1 = {
        a: 1
      }
      const obj2 = {
        a: 2,
        b: 3
      }
      const m = $extend(obj1, obj2)
      expect(m.a).toBe(2)
      expect(m.b).toBe(3)
      expect(m).toBe(obj1)
    })

    test('should shallow extend reference type', () => {
      const obj1 = {
        b: {
          b1: '1b1',
          b2: {
            bb2: '1bb2'
          }
        }
      }
      const obj2 = {
        b: {
          b1: '2b1',
          b2: {
            bb2: '2bb2'
          }
        }
      }
      const m = $extend(obj1, obj2)
      expect(m.b.b1).toBe('2b1')
      expect(m.b.b2).toBe(obj1.b.b2)
      expect(m.b.b2).toBe(obj2.b.b2)
    })

    test('should deep extend reference type', () => {
      const obj1 = {
        a: [1, 2, 3],
        b: {
          b1: '1b1',
          b2: {
            bb2: '1bb2'
          }
        }
      }
      const obj2 = {
        a: [4, 5, 6],
        b: {
          b1: '2b1',
          b2: {
            bb2: '2bb2'
          }
        }
      }
      const m = $extend(true, obj1, obj2)
      expect(m).toEqual({
        a: [4, 5, 6],
        b: {
          b1: '2b1',
          b2: {
            bb2: '2bb2'
          }
        }
      })
      expect(m.a).toBe(obj1.a)
      expect(m.a).not.toBe(obj2.a)
      expect(m.b).toBe(obj1.b)
      expect(m.b).not.toBe(obj2.b)
    })
  })
})
