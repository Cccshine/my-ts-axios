import { isPlainObject, isString } from './utils'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  if (isString(data)) {
    try {
      data = JSON.parse(data)
    } catch (e) {}
  }
  return data
}
