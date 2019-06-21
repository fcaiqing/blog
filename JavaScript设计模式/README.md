## JavaScript设计模式学习笔记
- [单例模式](#单例模式)
  - [常见实现](#常见实现)
  - [透明单例模式](#透明单例模式)
  - [代理实现的单例模式](#代理实现的单例模式)
  - [JavaScript单例模式](#JavaScript单例模式)
    - [常见解决变量污染](#常见解决变量污染)
  - [JavaScript中惰性单例模式](#JavaScript中惰性单例模式)
- [策略模式](#策略模式)
- [代理模式](#代理模式)
- [迭代器模式](#迭代器模式)
- [观察者模式](#观察者模式)
- [命令模式](#命令模式)
- [组合模式](#组合模式)
- [模板模式](#模板方法模式)
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
### 代理模式
> 使用代理对象进行占位，以便控制对本体的访问，客户——>代理对象——>本体

#### 常见代理示例
1. 模块延迟加载-代理对象和本体实现相同接口
> Send.js模块提供了send方法，未加载时采用代理对象缓存任务，模块加载后再执行
```JavaScript
//代理对象
var Send = (function() {
    let _cache = []
    function _loadSendModule(e) {
        var script = document.createElement('script')
        script.onload = function() {
            _cache.forEach((fn) => {
                fn()
            })
        }
        script.src = 'send.js'
        document.querySelector('head').appendChild(script)
    }
    document.body.addEventListener('click', _loadSendModule)
    return {
        send() {
            let args = arguments
            _cache.push(() => {
                return Send.send.apply(Send, args)
            })
        }
    }
})()
//Send.js
Send = {
    send(){
        //......
    }
}

```
2. 合并请求
> 通过代理对象执行请求，待操作结束后通过代理对象一次性发送请求，可以较少网络资源占用
```JavaScript
//本体
var sendData = function(...args) {
    console.log('保存id', args)
}

var proxySendData = (function() {
    let _cache = [], timer = null
    return function() {
        [].push.apply(_cache, arguments)
        if (timer) return 
        timer = setTimeout(() => {
            timer = null
            _cache = []
            sendData(..._cache)
        }, 1000)
    }
})()
```
3. 缓存代理
> 通过代理对象添加结果缓存

### 迭代器模式
> 提供一种方法顺序访问对象内各个元素而不需要暴露它的内部实现，比如Generator

### 观察者模式
> 又称发布订阅模式，描述了一种一对多的关系

```JavaScript
class Watcher {
    constructor() {
        this.clientList = {}
    }
    //添加订阅
    listen(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    }
    //移除订阅
    remove(key, fn) {
        let fns = this.clientList[key]
        if (!fns || fns.length == 0) return false
        if (!fn) {
            fns && (fns.length = 0)
        }else {
           for (let i = 0; i < fns.length; i++) {
               if (fn === fns[i]) {
                   fns.splice(i, 1)
               }
           } 
        }
    }
    publish(key) {
        let fns = this.clientList[key]
        Array.prototype.shift.call(arguments)
        if (!fns || fns.length == 0) return false
        for (let i = 0, fn; i < fns.length; i++) {
            fn = fns[i++]
            fn.apply(this, arguments)
        }
    }
}

class Shop extends Watcher {
    constructor() {
        super()
        this.origin = 0
    }
    add() {
         this.origin++
    }
    getOrigin() {
        return this.origin
    }
}

var shop = new Shop()

shop.listen('xiaoming', function(num) {
    console.log('origin 数量: ' + num)
})
shop.add()  //商店有水果了
shop.publish('xiaoming', 20)
//xiaoming 接受到信息
//origin 数量: 20
```
> 使用同一个发布订阅对象，还可以实现两个相互独立的模块间的通信
```JavaScript
var watcher = new Watcher()
var moduleA = (function() {
    return {
    num: 0,
    addNum() {
        this.num++
        watcher.publish('moduleB', this.num)
    }
}
})()
var moduleB = (function() {
    let _num = 0
    watcher.listen('moduleB', function(num) {
        _num = num
    })
    return {
        log() {
            console.log('获取来自moduleA的数据，num: ', _num)
        }
    }
})()
moduleA.addNum()
moduleB.log()   //获取来自moduleA的数据，num:  1

```
### 命令模式
> 当客人向餐厅服务员下单时，不必关心是哪位厨师去完成炒菜操作，只需向服务员下单就行。这里的服务员就是command对象，负责接收指令，而执行指令时command对象又会委托给设定好的执行者去执行。

```JavaScript
//button为点菜按钮，可以执行点菜命令
var chef = {
    cook() {
        console.log('菜品制作完成')
    }
}
var cookingCommand = function(receiver) {
    return {
        execute(){
            receiver.cook()
        }
    }
}
var setCommand = function(button, commander) {
    button.onclick = function() {
        commander.execute()
    }
}
setCommand(document.querySelector('button'), cookingCommand(chef))
//菜品制作完成
```
#### 命令队列
> 当请求命令较多时，可以通过命令队列保存命令，当前命令执行完后通知队列执行下一个命令
```JavaScript
var chef1 = {
    id: 'chef1',
    busy: false,
    cook() {
        let self = this
        self.busy = true
        setTimeout(() => {
            console.log('chef1', '菜品制作完成')
            self.busy = false
            watcher.publish('chef1', 'chef1')
        }, 1000)
    }
}
var chef2 = {
    id: 'chef2',
    busy: false,
    cook() {
        let self = this
        self.busy = true
        setTimeout(() => {
            console.log('chef2', '菜品制作完成')
            self.busy = false
            watcher.publish('chef2', 'chef2')
        }, 2000)
    }
}
var cookingCommand = function(receiver) {
    return {
        id: receiver.id,
        busy: receiver.busy,
        execute(){
            receiver.cook()
        }
    }
}
var manageCommand = {
    commandList: {chef1:[], chef2:[]},
    execute(commander, id) {
        if (!commander) {
            this.commandList[id].length > 0 
                && this.commandList[id].shift().execute()
        }else {
            if (commander.busy) {
                var id = commander.id
                this.commandList[id].push(commander)
                return
            }
            commander.execute()
        }
    }
}
class Watcher {
    constructor() {
        this.clientList = {}
    }
    //添加订阅
    listen(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    }
    //移除订阅
    remove(key, fn) {
        let fns = this.clientList[key]
        if (!fns || fns.length == 0) return false
        if (!fn) {
            fns && (fns.length = 0)
        }else {
           for (let i = 0; i < fns.length; i++) {
               if (fn === fns[i]) {
                   fns.splice(i, 1)
               }
           } 
        }
    }
    publish(key) {
        let fns = this.clientList[key]
        Array.prototype.shift.call(arguments)
        if (!fns || fns.length == 0) return false
        for (let i = 0, fn; i < fns.length; i++) {
            fn = fns[i++]
            fn.apply(this, arguments)
        }
    }
}
const watcher = new Watcher()
watcher.listen('chef1', function(id) {
    manageCommand.execute(null, id)
})
watcher.listen('chef2', function(id) {
    manageCommand.execute(null, id)
})
manageCommand.execute(cookingCommand(chef1))
manageCommand.execute(cookingCommand(chef2))
manageCommand.execute(cookingCommand(chef1))
manageCommand.execute(cookingCommand(chef2))
manageCommand.execute(cookingCommand(chef1))
manageCommand.execute(cookingCommand(chef2))
```
### 组合模式
> 组合模式(Composite Pattern)也称部分-整体模式，把一组相似的对象组成树形结构，节点或叶节点都有相同的行为，其中节点可以包含其他节点和叶节点

> 组合模式适用场景
- 部分-整体分层模型结构，不用关心有多少层级结构
- 统一处理相似数据模型，不用区分具体是何种类型，统一当做一个节点处理
>案例：一个公司有8名员工，CEO: 一级部门，level1，三个二级部门level2，市场，技术，商务，这三个部门分别有1,2,1个员工level3，要求打印一张公司员工信息表
 ```JavaScript
 /*
  *                       CEO  (LEVEL1)
  *                   /      |       \
  *           Market Technical  Commerce  (LEVEL2)
  * Employee       1       2        1       (LEVEL3)
  * 
  */

class Employee {
    constructor(name, level, dept) {
        this.name = name
        this.level = level
        this.dept = dept
        this.subordinate = []   //下属节点
    }
    //添加下属
    add(employee) {
        if (this.level >= 3) throw new Error('等级不够无法添加员工')
        this.subordinate.push(employee)
    }
    //移除下属
    remove(employee) {
        this.subordinate.forEach((e, i) => {
            if (e === employee) this.subordinate.splice(i, 1)
        })
    }
}

var ceo = new Employee('ceo', 1, 'boss')
var market = new Employee('dept head', 2, 'market')
var tech = new Employee('dept head', 2, 'technical')
var commerce = new Employee('dept head', 2, 'commerce')
ceo.add(market)
ceo.add(tech)
ceo.add(commerce)
market.add(new Employee('employee', 3, 'market'))
tech.add(new Employee('employee', 3, 'technical'))
tech.add(new Employee('employee', 3, 'technical'))
commerce.add(new Employee('employee', 3, 'commerce'))
function log(employee) {
    console.log(`${employee.name} - ${employee.level} - ${employee.dept}`)
    if (employee.subordinate.length == 0) return
    employee.subordinate.forEach(e => {
        log(e)
    })
}
log(ceo)
 ```
### 模板方法模式
定义一个超类，超类中定义一系列方法，定义了一个模板————封装了完成一个功能、行为的步骤流程，子类根据需要重载超类方法，但是会调用超类模板方法，按照模板规定行为运行

案例1

```JavaScript
/*
 *定义一个游戏运行模板，负责运行各种游戏
 */
class Game {
    register() {
        console.log('角色注册')
    }
    initialize() {
        console.log('初始化游戏')
    }
    start() {
        console.log('开始玩游戏')
    }
    end() {
        console.log('结束游戏')
    }
    //模板方法-抽象出不变的流程步骤，每步具体操作可变
    play() {
        this.register()
        this.initialize()
        this.start()
        this.end()
    }
}

class Card extends Game {
    constructor(name) {
        super(name)
        this.name = name
    }
    register() {
        console.log(`${this.name} - 注册成功`)
    }
    initialize() {
       console.log(`${this.name} - 游戏开始初始化`) 
    }
    start() {
        console.log(`${this.name} - 游戏已经开始`)
    }
    end() {
        console.log(`${this.name} - 游戏已经结束`)
    }
}

class Ball extends Game {
    constructor(name) {
        super(name)
        this.name = name
    }
    register() {
        console.log(`${this.name} - 注册成功`)
    }
    initialize() {
       console.log(`${this.name} - 足球游戏开始初始化`) 
    }
    start() {
        console.log(`${this.name} - 足球游戏已经开始`)
    }
    end() {
        console.log(`${this.name} - 足球游戏已经结束`)
    }
}

const cardGame = new Card('卡牌游戏')
cardGame.play()

const ballGame = new Ball('球类游戏')
ballGame.play()
```
