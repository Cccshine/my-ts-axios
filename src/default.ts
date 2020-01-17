import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },
  validateStatus: function(status) {
    return status >= 200 && status < 300
  },
  transformRequest: function(data: any, headers?: any): any {
    processHeaders(headers, data)
    return transformRequest(data)
  },
  transformResponse: function(data: any): any {
    return transformResponse(data)
  }
}
const methodsNoData = ['get', 'delete', 'options', 'head']
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodWithData = ['post', 'put', 'patch']
methodWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlcoded'
  }
})
export default defaults
