import { transformRequest } from '../../src/helpers/data'

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
})
