import { processHeaders } from '../../src/helpers/headers'

describe('helpers:headers', () => {
  describe('processHeaders', () => {
    test('should normalize Content-Type header name', () => {
      const headers: any = {
        'ConteNt-TYpe': 'cc',
        'Content-Length': 1024
      }
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('cc')
      expect(headers['ConteNt-TYpe']).toBeUndefined()
      expect(headers['Content-Length']).toBe(1024)
    })

    test('should set Content-Type if not set and data is PlainObject', () => {
      const headers: any = {}
      processHeaders(headers, { foo: 'bar' })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should not set Content-Type if not set and data is not PlainObject', () => {
      const headers: any = {}
      processHeaders(headers, new FormData())
      expect(headers['Content-Type']).toBeUndefined()
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(processHeaders(null, {})).toBeNull()
      expect(processHeaders(undefined, {})).toBeUndefined()
    })
  })
})
