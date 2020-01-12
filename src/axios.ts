import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './default'
import mergeConfig from './core/mergeConfig'

// 实现类型为AxiosInstance的混合对象
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // Axios的实例，可以访问到原型上的request,get ,post等方法，以此作为混合对象的类接口部分
  let context = new Axios(config)
  // Axios原型方法request作为混合对象的函数接口，主要要将函数内部的this绑定为Axios类的实例
  let instance = Axios.prototype.request.bind(context)
  // 将实例上的属性和方法（包括原型上的）扩展到instance里，此时instance就成为了一个混合对象
  extend(instance, context)
  // Object.assign(instance, context);  这个只能拷贝自身的属性，不会拷贝继承的
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function(config?: AxiosRequestConfig): AxiosInstance {
  return createInstance(mergeConfig(defaults, config))
}
export default axios
