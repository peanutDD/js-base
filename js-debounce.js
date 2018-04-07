/* jshint esversion:6 */


// debounce 策略的电梯。如果电梯里有人进来，等待50毫秒。如果又人进来，50毫秒等待重新计时，直到50毫秒超时，开始运送。

let debounce = (fn, time = 50) => { // 防抖动 控制空闲时间 用户输入频繁
    let timer;
    return function (...args) {
        let that = this;
        clearTimeout(timer);
        timer = setTimeout(fn.bind(that, ...args), time);
    };
};
