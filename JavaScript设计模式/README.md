## JavaScript设计模式学习笔记
- [单例模式](#单例模式)
  - [常见实现](#常见实现)
  - [透明单例模式](#透明单例模式)
  - [代理实现的单例模式](#代理实现的单例模式)
  - [JavaScript单例模式](#JavaScript单例模式)
    - [常见解决变量污染](#常见解决变量污染)
  - [JavaScript中惰性单例模式](#JavaScript中惰性单例模式)
 
### 单例模式

#### 常见实现
---
> 这种方式不能像普通类一样通过new获取实例，必须通过特定方法获取实例
```JavaScript
var SingleTon = function(name) {
    this.name = name
}
SingleTon.getInstance = (function () {
    let _ret = null
    return function(name) {
        return _ret ? _ret : (_ret = new SingleTon(name))
    }
})()

var sing1 = SingleTon.getInstance('cv')
var sing2 = SingleTon.getInstance('gh')
sing1 === sing2 //true
```
#### 透明单例模式
---
> 直接使用类实例化对象，不需要调用特定方法，对使用者来说就是一个普通类
```JavaScript
var SingleTon = (function(){
    let _ret = null
    let _SingleTon = function(name) {
        this.name = name
        return _ret ? _ret : (_ret = this)
    }
    return _SingleTon
})()
var sing1 = new SingleTon('df')
var sing2 = new SingleTon('hk')
sing1 === sing2 //true
```
#### 代理实现的单例模式
> 透明单例模式将类和单例实现逻辑耦合在一起，不满足“职责单一原则”，例如有时需要使用这个类创建很多不同对象而非单例时就会增加额外代码。
```JavaScript
var SingleTon = function(name) {
    this.name = name
}
var ProxyCreateSingleTon = (function(){
    let _ret = null
    return function(name) {
        return _ret ? _ret : (_ret = new SingleTon(name))
    }
})()

var sing1 = new ProxyCreateSingleTon('dsfd')
var sing2 = new ProxyCreateSingleTon('fghgf')
sing1 === sing2 //true
```
#### JavaScript单例模式
---
> 上面所说的单例模式实现都是按照传统的面向对象实现，而在JavaScript中可以直接创建单例,如，var singleton = {}，只要解决全局变量勿扰问题

#### 常见解决变量污染
- 命名空间
- 闭包封装变量

#### JavaScript中惰性单例模式
---
> 这个单例模式更加符合JavaScript创建对象的特点，并且只在触发的时候才创建并只执行一次函数
#### 根据单一职责原则，我们把创建实例和管理单例模块分离，以便复用
- 可以方便创建任何单例
- 可以创建非单例对象
- 管理单例模块可以用于管理任何只要只要一次的模块

```JavaScript
function Father(name) {
    this.name = name
}

function Mother(name) {
    this.name = name
}

//只执行一次操作
function addOnce() {
    let i = 0
    i += 1
    return {
        getValue() {
            return i
        }
    }
}

//calledNoNew：可选参数表示直接创建
var getSingleTon = function(fn, calledNoNew) {
    let _ret = null
    return function (...arg) {
        let _me = this
        if (calledNoNew) {
           return _ret ? _ret : (_ret = fn.apply(_me, arg))
        }
        return  _ret ? _ret : (_ret = new fn(...arg))
    }
}

var createSingleFather = getSingleTon(Father)
var father1 = createSingleFather('Tom')
var father2 = createSingleFather('Cat')
father1 === father2 //true

var createSingleMother = getSingleTon(Mother)
var mother1 = createSingleMother('Lucy')
var mother2 = createSingleMother('Luiy')
mother1 === mother2 //true

var executeOnce = getSingleTon(addOnce, true)
executeOnce()
executeOnce()
executeOnce().getValue()    //1
```
