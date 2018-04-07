/* jshint esversion:6 */

// 函数节流

// throttle 策略的电梯。保证如果电梯第一个人进来后，50毫秒后准时运送一次，不等待。如果没有人，则待机。

let throttle = (fn, delay = 50) => { // 节流 控制执行间隔时间 防止频繁触发 scroll resize mousemove
    let stattime = 0;
    return function (...args) {
        let curTime = new Date();
        if (curTime - stattime >= delay) {
            fn.apply(this, args);
            stattime = curTime;
        }
    };
};