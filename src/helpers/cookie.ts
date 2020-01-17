const cookie = {
  read(name: string): string | null {
    // 该正则匹配  ; name=xxx 或 name=xxx
    // (^|;\\s*) 表示直接开始或以; 开始
    // ([^;]*) 表示匹配任何不为;的字符
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
