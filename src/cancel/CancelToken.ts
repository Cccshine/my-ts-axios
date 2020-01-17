import {
  CancelTokenInterface,
  Canceler,
  CancelExecutor,
  CancelTokenSource,
  CancelInterface
} from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: CancelInterface): void
}

// CancelToken类实现CancelTokenInterface接口
export default class CancelToken implements CancelTokenInterface {
  promise: Promise<CancelInterface>
  reason?: CancelInterface
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<CancelInterface>(resolve => {
      resolvePromise = resolve
    })
    executor((message?: string) => {
      if (this.reason) {
        // reason存在，表示该token已经取消过
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel, // 取消函数
      token // CancelToken实例
    }
  }

  throwIfRequested(): void {
    if (this.reason) {
      // reason存在，表示该token已经取消过
      throw this.reason
    }
  }
}
