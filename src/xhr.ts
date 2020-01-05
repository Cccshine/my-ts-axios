import { AxiosRequestConfig, AxiosPromise, AxiosReponse } from './types/index'
import { isNull } from './helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { url, method = 'get', data = null, params = null, headers, responseType } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      const responseHeaders = request.getAllResponseHeaders()
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
      resolve(response)
    }
    request.open(method.toUpperCase(), url, true)
    Object.keys(headers).forEach(name => {
      if (isNull(data) && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)
  })
}
