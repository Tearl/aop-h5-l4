/**
 * @param {*} func 需要做节流的函数
 * @param {*} wait  触发间隔（默认16毫秒）
 * @return {*}
 */
export function throttle(func, wait = 16) {
  let timeout, context, args;
  let previous = 0;

  let later = function () {
    previous = +new Date();
    timeout = null;
    func.apply(context, args)
  };

  let throttled = function () {
    let now = + new Date();
    //下次触发 func 剩余的时间
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}