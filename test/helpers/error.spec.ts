import { AxiosRequestConfig, AxiosReponse } from '../../src'
import { createError, AxiosErrorObject } from '../../src/helpers/error'

describe('helpers:error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    let request = new XMLHttpRequest()
    let config: AxiosRequestConfig = {
      url: '/cc'
    }
    let response: AxiosReponse = {
      data: 'cc',
      status: 200,
      statusText: 'OK',
      headers: null,
      config: config,
      request: request
    }
    const error = createError('Boom!', config, 'SOMETHING', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error instanceof AxiosErrorObject).toBeTruthy()
    expect(error.code).toBe('SOMETHING')
    expect(error.config).toBe(config)
    expect(error.isAxiosError).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
  })
})
