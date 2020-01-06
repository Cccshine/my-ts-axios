import { transformRequest, transformResponse } from '../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a PlainObject', () => {
      const data = { foo: 'baz' }
      expect(transformRequest(data)).toBe('{"foo":"baz"}')
    })

    test('should do nothing if data is not a PlainObject', () => {
      const data = new FormData()
      data.append('name', 'cc')
      expect(transformRequest(data)).toBe(data)
    })
  })

  describe('transformResponse', () => {
    test('should JSON parse json string', () => {
      expect(transformResponse('{"a":1,"b":2}')).toEqual({ a: 1, b: 2 })
    })

    test('should not JSON parse if data is not json string', () => {
      expect(transformResponse('abc')).toBe('abc')
      expect(transformResponse(1)).toBe(1)
    })
  })
})
