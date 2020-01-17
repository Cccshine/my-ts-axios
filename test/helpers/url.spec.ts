import { buildURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support optional params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(buildURL('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      expect(buildURL('/foo', { foo: 'bar', baz: null })).toBe('/foo?foo=bar')
    })

    test('should ignore if the only param value is null', () => {
      expect(buildURL('/foo', { foo: null })).toBe('/foo')
    })

    test('should support object params', () => {
      expect(buildURL('/foo', { foo: { baz: 'bar' } })).toBe(
        '/foo?foo=' + encodeURI('{"baz":"bar"}')
      )
    })

    test('should support date params', () => {
      var date = new Date()
      expect(buildURL('/foo', { date: date })).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array params', () => {
      expect(buildURL('/foo', { foo: ['baz', 'bar'] })).toBe('/foo?foo[]=baz&foo[]=bar')
    })

    test('should support sepcial char params', () => {
      var str = '@:$ '
      expect(buildURL('/foo', { foo: str })).toBe('/foo?foo=@:$+')
    })

    test('shoudl support exsiting params', () => {
      expect(buildURL('/foo?foo=bar', { bar: 'baz' })).toBe('/foo?foo=bar&bar=baz')
    })

    test('should correct discard url hash mark', () => {
      expect(buildURL('/foo?foo=bar#hash', { bar: 'baz' })).toBe('/foo?foo=bar&bar=baz')
    })
  })
  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
