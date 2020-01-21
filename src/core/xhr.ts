import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { isNull, isFormData } from '../helpers/utils'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'

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
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      auth,
      onDownloadProgress,
      onUploadProgress,
      validateStatus
    } = config
    // 创建一个 request 实例
    const request = new XMLHttpRequest()
    // 执行 request.open 方法初始化
    request.open(method.toUpperCase(), url!, true)
    // 执行 configureRequest 配置 request 对象
    configureRequest()
    // 执行 addEvents 给 request 添加事件处理函数
    addEvents()
    // 执行 processHeaders 处理请求 headers
    processHeaders()
    // 执行 processCancel 处理请求取消逻辑
    processCancel()
    // 执行 request.send 方法发送请求
    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        // 跨域时是否携带cookie
        request.withCredentials = true
      }
    }

    function addEvents(): void {
      // readyState变化
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
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          request: request,
          config: config
        }
        if (!validateStatus || validateStatus(request.status)) {
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
      // 出错
      request.onerror = () => {
        reject(createError(`Network Error`, config, null, request))
      }
      // 超时
      request.ontimeout = () => {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }
      // 下载
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      // 上传
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      // FormData类型浏览器会根据内容自动设置Content-Type
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      // withCredentials为true或者是同域请求才设置， 因为这样才能携带cookie
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }
      // 设置请求头
      Object.keys(headers).forEach(name => {
        if (isNull(data) && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
  })
}
