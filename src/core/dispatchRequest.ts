import { AxiosRequestConfig, AxiosPromise, AxiosReponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transfromResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = flattenHeaders(config.headers, config.method!)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
  let { url, params } = config
  return buildURL(url!, params)
}

function transformHeaders(config: AxiosRequestConfig): any {
  let { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): any {
  let { data } = config
  return transformRequest(data)
}

function transfromResponseData(res: AxiosReponse): AxiosReponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export default dispatchRequest
