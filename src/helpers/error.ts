import { AxiosError, AxiosRequestConfig, AxiosReponse } from '../types'

export class AxiosErrorObject extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosReponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosReponse
  ) {
    super(message) // 相当于 Error.prototype.constructor.call(this)
    this.isAxiosError = true
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    // 解决 TypeScript 继承一些内置对象的时候的坑
    Object.setPrototypeOf(this, AxiosErrorObject.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosReponse
): AxiosError {
  let error = new AxiosErrorObject(message, config, code, request, response)
  return error
}
