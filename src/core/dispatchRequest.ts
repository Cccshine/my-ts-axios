import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config)
    .then(res => {
      // then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）
      return transformResponseData(res)
    })
    .catch(e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      // catch方法也会返回一个新的Promise实例，如果return不用Promise.reject处理，后续的会走到then里面去导致出错
      return Promise.reject(e)
    })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = flattenHeaders(config.headers, config.method!)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

// function transformHeaders(config: AxiosRequestConfig): any {
//   let { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

// function transformRequestData(config: AxiosRequestConfig): any {
//   let { data } = config
//   return transformRequest(data)
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default dispatchRequest
