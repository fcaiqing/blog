## JavaScript中高阶函数常见应用
---
### currying-柯里化

> currying常见应用就是部分求值,比如对不知道多少数量的数字求和

```JavaScript
function _add(...arg) {
    return arg.reduce((total, num) => {
        return total + num
    }, 0)
}
function currying(fn) {
    let args = []
    return function f() {
        if (arguments.length == 0) {
            return fn.apply(null, args)
        } else {
            [].push.apply(args, arguments)
            return f
        }
    }
}

var add = currying(_add)
add(1)(2)(3)(4)()   //10
```
### uncurrying

> 常见应用自定义简化函数，比如Array.prototype.push，Array.prototype.shift等

```JavaScript
Function.prototype.uncurrying = function() {
    let _self = this
    return function() {
        return Function.prototype.call.apply(_self, arguments)
    }
}
var obj = [1,2]
var push = Array.prototype.push.uncurrying()
push(obj, 3, 4) //obj [1, 2, 3, 4]
```
### 节流函数

> 避免短时间内函数频繁触发
```JavaScript
function throttle(fn, delay) {
    let _timer
    return function() {
        let _args = arguments
        let _me = this
        if (_timer) return   //定时器未执行玩
        _timer = setTimeout(() => {
            fn.apply(_me, _args)
            clearTimeout(_timer)
        }, delay || 200)
    }
}

var lg = throttle(console.log, 1000)
lg(1,2,4)
```
### 分时函数

> 常见应用场景：批量执行较多任务影响性能，可以按时间间隔执行

```JavaScript
/**
 * 分时函数
 * data 待处理数据
 * fn任务函数
 * count每次处理数据
*/
function timeChunk(data, fn, count) {
    let _t, _item
    return function() {
        _t = setInterval(() => {
            if (data.length == 0) {
                return clearInterval(_t)
            }
            _start()
        }, 1000)
    }
    function _start() {
        for (let i = 0; i < Math.min(count || 1, data.length); i++) {
            _item = data.shift()
            fn(_item)
        }
    }
}
var data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
var lg = timeChunk(data, console.log, 2)
lg()
```

### 惰性加载函数

> 惰性加载用于需要时才进行任务，应用之一：浏览器嗅探，只有调用时才进行嗅探且只嗅探一次

```JavaScript
var addEvent = function(ele, type, fn) {
    if (window.addEventListener) {
        addEvent = function() {
            ele.addEventListener(type, fn, false)
        }
    } else if (window.attachEvent) {
        addEvent = function() {
            ele.attachEvent(type, fn, false)
        }
    }
    addEvent()
}
addEvent(document, 'click', console.log)
```

