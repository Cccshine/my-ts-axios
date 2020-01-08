const toString = Object.prototype.toString
// 类型谓词开启类型保护 parameterName is Type
// 如果该函数的返回值为true，则意味着类型谓词是成立的，于是它后面的作用域的类型也就被固定为Type
export function isNull(val: any): val is null {
  return val === null
}

export function isUndefined(val: any): val is undefined {
  return val === void 0
}

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

// 泛型函数,使用交叉类型
export function extend<T, U>(to: T, from: U): T & U {
  for (let key in from) {
    // key是T类型的键名，to是U类型，所以不可以直接to[key]
    // from[key]是T类型的键值，to[key]是U类型的键值，两者不可直接赋值
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
