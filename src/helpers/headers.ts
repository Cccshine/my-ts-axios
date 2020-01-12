import { isPlainObject, deepMerge } from './utils'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data) && headers && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let splitIndex = line.indexOf(':')
    if (splitIndex === -1) {
      return
    }
    let key = line.slice(0, splitIndex)
    let val = line.slice(splitIndex + 1)
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    val && (val = val.trim())
    parsed[key] = val
  })
  return parsed
}

// 把headers.common/headers.get等扁平化到一级
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodHeaderKeys = ['get', 'post', 'delete', 'head', 'options', 'put', 'patch', 'common']
  methodHeaderKeys.forEach(key => {
    delete headers[key]
  })

  return headers
}
