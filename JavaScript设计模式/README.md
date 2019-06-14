## JavaScript设计模式学习笔记
- [单例模式](#单例模式)
  - [常见实现](#常见实现)
  - [透明单例模式](#透明单例模式)
  - [代理实现的单例模式](#代理实现的单例模式)
  - [JavaScript单例模式](#JavaScript单例模式)
    - [常见解决变量污染](#常见解决变量污染)
  - [JavaScript中惰性单例模式](#JavaScript中惰性单例模式)
- [策略模式](#策略模式)
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
### 策略模式
---
> 定义一系列的算法或行为，将它们一一分别封装，启动运行时根据业务类型执行不同行为或算法

案例：设计一个发声系统，能够发出不通动物叫声
1. 实现
```JavaScript
class Dog{
    getVoice() {
        console.log('汪汪')
    }
}
class Cat{
    getVoice() {
        console.log('喵喵')
    }
}
class Tiger{
    getVoice() {
        console.log('吼吼')
    }
}

class VoiceSystem{
    constructor(type) {
        this.type = type
    }
    showVoice() {
        let type = this.type
        if (type == 'dog') {
            new Dog().getVoice()
        } else if (type == 'cat') {
            new Cat().getVoice()
        } else if (type == 'tiger') {
            new Tiger().getVoice()
        }
    }
}
new VoiceSystem('dog').showVoice()  //汪汪
new VoiceSystem('cat').showVoice()  //喵喵
new VoiceSystem('tiger').showVoice()    //吼吼
```
上述实现缺点
- 系统缺乏弹性，每次进行声音扩充都需要更新系统类，违反开放-封闭原则
- 系统中由于集成很多模块导致系统庞大,比如系统中的shouVoice模块

2. 基于策略模式实现
> 设计模式一定是将可变部分和不可变部分进行分离，同样策略模式也是讲算法实现和使用分开，具体就是分为策略类和环境类，前者封装了各个算法实现，后者接受客户业务请求，然后把请求委托给策略对象
```JavaScript
//策略类
class Dog{
    getVoice() {
        console.log('汪汪')
    }
}
class Cat{
    getVoice() {
        console.log('喵喵')
    }
}
class Tiger{
    getVoice() {
        console.log('吼吼')
    }
}
//环境类
class VoiceSystem{
    constructor() {
        this.strategy = null    //策略对象
    }
    setStrategy(strategy) {
        this.strategy = strategy
    }
    showVoice() {
        this.strategy.getVoice()
    }
}

var sys1 = new VoiceSystem()
sys1.setStrategy(new Cat()) //设置策略对象
sys1.showVoice()    //喵喵

var sys2 = new VoiceSystem()
sys2.setStrategy(new Dog()) //设置策略对象
sys2.showVoice()    //汪汪
```
3. JavaScript中的策略模式
> JavaScript中一切都可以看做对象，因此可以直接定义策略对象和环境对象
```JavaScript
var strategy = {
    dog: {
        getVoice() {
            console.log('汪汪')
        }
    },
    cat: {
        getVoice() {
            console.log('喵喵')
        }
    },
    tiger: {
        getVoice() {
            console.log('吼吼')
        }
    }
}

var voiceSystem = {
    showVoice(type) {
        strategy[type].getVoice()
    }
}
voiceSystem.showVoice('cat')    //喵喵
voiceSystem.showVoice('dog')    //汪汪

```
