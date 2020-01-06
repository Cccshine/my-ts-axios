import { processHeaders, parseHeaders } from '../../src/helpers/headers'

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

  describe('parseHeaders', () => {
    test('should do nothing if headers is empty', () => {
      expect(parseHeaders('')).toEqual({})
    })

    test('should parse headers', () => {
      const parsed = parseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:\r\n' +
          'cc'
      )
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
      expect(parsed['cc']).toBeUndefined()
    })
  })
})
