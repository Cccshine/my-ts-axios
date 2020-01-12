import { AxiosRequestConfig, AxiosPromise, AxiosReponse } from '../types'
import { isNull } from '../helpers/utils'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      params = null,
      headers,
      responseType,
      timeout,
      cancelToken
    } = config
    const request = new XMLHttpRequest()
    if (timeout) {
      request.timeout = timeout
    }
    if (responseType) {
      request.responseType = responseType
    }
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
        // 网络错误或者超时错误时status为0
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosReponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        request: request,
        config: config
      }
      if (request.status >= 200 && request.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
    request.onerror = () => {
      reject(createError(`Network Error`, config, null, request))
    }
    request.ontimeout = () => {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }
    request.open(method.toUpperCase(), url!, true)
    Object.keys(headers).forEach(name => {
      if (isNull(data) && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }
  })
}
