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
  - [钩子方法](#钩子方法)
- [享元模式](#享元模式)
  - [对象池](#对象池)
- [职责链模式](#职责链模式)
  - [AOP实现职责链](#AOP实现职责链)
- [中介者模式](#中介者模式)
- [装饰者模式](#装饰者模式)
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
#### 钩子方法

在具体场景应用时，有时需要需要模板方法中封装的流程可以定制化，这时可以使用钩子方法

```JavaScript
class Game {
    register() {
        console.log('角色注册')
    }
    //执行注册开关
    registerSwitch() {
        return true
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
        if (this.registerSwitch()) {
            this.register()
        }
        this.initialize()
        this.start()
        this.end()
    }
}
//Football游戏不需要注册就可以玩
class Football extends Game {
    constructor(name, type) {
        super(name)
        this.name = name
        this.type = type    //游戏是否收费 0：收费 1：免费
    }
    register() {
        console.log(`${this.name} - 注册成功`)
    }
    registerSwitch() {
        let _opt = {
            
            0: () => {
                
                return true
            },
            1: () => {
                return false
            }
        }
        return _opt[this.type]()
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
const fb0 = new Football('football0', 0)
const fb1 = new Football('football1', 1)
fb0.play()  //需要注册
fb1.play()  //不需要注册
```
### 享元模式

通过减少对象创建数量，以减少内存占用和提高性能。

具体通过分离出内部状态和外部状态来实现
- 内部状态存储在对象内部，决定创建对象个数，内部状态可以看做对象在内存中的标识符，没有时创建存在时直接返回对象
- 外部状态和应用场景相关，在需要时传入对象中，可以看做具体业务时的需要的外部数据

案例

> 现在需要绘制1000个图形，其中方形、圆形、椭圆形、三角形各250个，每种类型的颜色、大小均随机

正常实现: 创建了1000个对象去执行绘制操作

```JavaScript
const DrawTools = {
    //方形
    square: function draw(params) {
        console.log(`方形 - w：${params.w} - h：${params.h} - 
        颜色：${params.color}`)
    },
    //圆形
    circle: function draw(params) {
        console.log(`圆形 - 半径：${params.radius} - 
        颜色：${params.color}`)
    },
    //椭圆形
    ellipse: function draw(params) {
        console.log(`椭圆形 - a：${params.a} - b：${params.b}- 
        颜色：${params.color}`)
    },
    //三角形
    triangle: function draw(params) {
        console.log(`三角形 - x：${params.x} - 
        y：${params.y} - z：${params.z} - 
        颜色：${params.color}`)
    }
}

function Graphics(type) {
    this.type = type    //对象初始化时存储，内部状态
}

Graphics.prototype.draw = function(operator) {
    operator[this.type](this.params)
}

Graphics.prototype.setParams = function (params) {
    this.params = params    //外部状态，具体业务场景时在传入对象的数据
}

function drawDemo(num = 1000) {
    let startT = +new Date
    let aver = num / 4
    let color = ['blue', 'green', 'yellow', 'white']
    for (let i = 1; i <= num; i++) {
        if (i <= aver) {    //画方形
            let wh = [[10, 2], [2, 4], [7,8]][Math.floor((Math.random()*3))]
            let square = new Graphics('square')
            //具体场景数据，不同尺寸、颜色
            square.setParams({
                w: wh[0],
                h: wh[1],
                color: color[Math.floor(Math.random()*color.length)]
            })
            square.draw(DrawTools)
        }else if (i <= 2 * aver) {    //圆形
            let radius = [1, 2, 3, 5, 9]
            let circle = new Graphics('circle')
            circle.setParams({
                radius: radius[Math.floor(Math.random()*radius.length)],
                color: color[Math.floor(Math.random()*color.length)]
            })
            circle.draw(DrawTools)
        }else if (i <= 3 * aver) {    //椭圆形
            let ab = [[1, 2], [3, 4], [6, 8]][Math.floor((Math.random()*3))]
            let ellipse = new Graphics('ellipse')
            ellipse.setParams({
                a: ab[0],
                b: ab[1],
                color: color[Math.floor(Math.random()*color.length)]
            })
            ellipse.draw(DrawTools)
        }else if(i <= 4 * aver) { //三角形
            let xyz = [[6, 7, 8], [3, 4, 5], [2, 1, 2]]
            let triangle = new Graphics('triangle')
            triangle.setParams({
                x: xyz[0],
                y: xyz[1],
                z: xyz[2],
                color: color[Math.floor(Math.random()*color.length)]
            })
            triangle.draw(DrawTools)
        }
    }
    console.log(`用时 - ${new Date - startT}ms`)
}
drawDemo()
```
享元模式实现：创建了4个对象完成绘制
- 对象通过工厂函数创建
- 外部状态在业务需要时，通过特定方法传入对象内部

```JavaScript
const DrawTools = {
    //方形
    square: function draw(params) {
        console.log(`方形 - w：${params.w} - h：${params.h} - 
        颜色：${params.color}`)
    },
    //圆形
    circle: function draw(params) {
        console.log(`圆形 - 半径：${params.radius} - 
        颜色：${params.color}`)
    },
    //椭圆形
    ellipse: function draw(params) {
        console.log(`椭圆形 - a：${params.a} - b：${params.b}- 
        颜色：${params.color}`)
    },
    //三角形
    triangle: function draw(params) {
        console.log(`三角形 - x：${params.x} - 
        y：${params.y} - z：${params.z} - 
        颜色：${params.color}`)
    }
}

function Graphics(type) {
    this.type = type    //内部状态
}

Graphics.prototype.draw = function(operator) {
    operator[this.type](this.params)
}

Graphics.prototype.setParams = function (params) {
    this.params = params    //外部状态
}

//工厂函数，内部状态决定对象个数
var GraphicsFactory = (function () {
    let _objCache = {}
    return {
        create(type) {
            return _objCache[type] ? _objCache[type] 
                : (_objCache[type] = new Graphics(type))
        },
        getObjCache() {
            return _objCache
        }
    }
})()

function drawDemo(num = 1000) {
    let startT = +new Date
    let aver = num / 4
    let color = ['blue', 'green', 'yellow', 'white']
    for (let i = 1; i <= num; i++) {
        if (i <= aver) {    //画方形
            let wh = [[10, 2], [2, 4], [7,8]][Math.floor((Math.random()*3))]
            let square = GraphicsFactory.create('square')
            //具体场景数据，不同尺寸、颜色
            square.setParams({
                w: wh[0],
                h: wh[1],
                color: color[Math.floor(Math.random()*color.length)]
            })
            square.draw(DrawTools)
        }else if (i <= 2 * aver) {    //圆形
            let radius = [1, 2, 3, 5, 9]
            let circle = GraphicsFactory.create('circle')
            circle.setParams({
                radius: radius[Math.floor(Math.random()*radius.length)],
                color: color[Math.floor(Math.random()*color.length)]
            })
            circle.draw(DrawTools)
        }else if (i <= 3 * aver) {    //椭圆形
            let ab = [[1, 2], [3, 4], [6, 8]][Math.floor((Math.random()*3))]
            let ellipse = GraphicsFactory.create('ellipse')
            ellipse.setParams({
                a: ab[0],
                b: ab[1],
                color: color[Math.floor(Math.random()*color.length)]
            })
            ellipse.draw(DrawTools)
        }else if(i <= 4 * aver) { //三角形
            let xyz = [[6, 7, 8], [3, 4, 5], [2, 1, 2]]
            let triangle = GraphicsFactory.create('triangle')
            triangle.setParams({
                x: xyz[0],
                y: xyz[1],
                z: xyz[2],
                color: color[Math.floor(Math.random()*color.length)]
            })
            triangle.draw(DrawTools)
        }
    }
    console.log(`用时 - ${new Date - startT}ms`)
}
drawDemo()
```
#### 对象池

同享元模式相似，都是性能优化方案，不过不用分离内部状态和外部状态

对象池维护一个装载空闲对象的内存池，当需要对象完成业务时直接从对象池获取，否则创建新的对象，任务完成后将对象回收到对象池

常见应用如http连接池、数据库连接池，在web中常用来缓存DOM对象，减少DOM节点创建和删除

```JavaScript
//页面显示5张图，一段时间后更换
function objectPoolFactory(fn) {
    let _objectPool = []
    return {
        create() {
            let obj = _objectPool.length == 0 ? fn.apply(null, arguments) 
                : _objectPool.shift()
            return obj
        },
        recycle(obj) {
            _objectPool.push(obj)
        }
    }
}

var ImgFactory = objectPoolFactory(() => {
    let img = document.createElement('img')
    document.body.appendChild(img)
    img.onload = () => {
        ImgFactory.recycle(img) //图片加载完成后回收对象
    }
    return img
})

for (let i = 0; i < 5; i++) {
    var img = ImgFactory.create()
    img.src = 'xx'+ i + '.jpg'
}

setTimeout(() => {
    for (let i = 0; i < 5; i++) {
        var img = ImgFactory.create()
        img.src = 'yy'+ i + '.jpg'
    }
}, 5000)
```
### 职责链模式

创建了一个处理请求的对象链，请求会沿着链依次传递直到被处理；请求发送者不需要关心接受者，只需将请求发送到链的第一个节点就行，请求发送者和接受者之间进行了解耦

示例：打印日志信息，其中每个日志模块只能打印级别不低于自己的信息，否者交给更低级别模块打印

```JavaScript
//打印处理模块
const LogTools = {
    error: {
        level: 3,
        log(message) {
            console.error(`error - ${message}`)
        }
    },
    warn: {
        level: 2,
        log(message) {
            console.warn(`warn - ${message}`)
        }
    },
    info: {
        level: 1,
        log(message) {
            console.log(`info - ${message}`)
        }
    }
}

//职责链中节点类
function LogChain(logTool) {
    this.level = logTool.level  //节点处理日志级别
    this.log = logTool.log  //处理逻辑
    this._nextChainNode = null    //下个节点
}

LogChain.prototype.setNextChainNode = function(chain) {
    this._nextChainNode = chain
}

//节点处理请求或是转发请求
LogChain.prototype.handleRequest = function(level, msg) {
    'use strict';
    if (this.level <= level) {
        //非严格模式下，arguments和函数参数变量引用关联，此时msg会覆盖level；严格模式下非引用关联
        [].shift.apply(arguments)
        this.log.apply(this, arguments)
    }
    if (this._nextChainNode) {
        //请求传递
        this._nextChainNode.handleRequest(level, msg)
    }
}

function chainDemo() {
    let chain = _getChain()
    chain.handleRequest(1, 'info log message.')
    chain.handleRequest(2, 'warn log message.')
    chain.handleRequest(3, 'error log message.')

    //获取职责链
    function _getChain() {
        //在业务需要时进行节点组合，业务和功能模块解耦
        let errorChain = new LogChain(LogTools.error)
        let warnChain = new LogChain(LogTools.warn)
        let infoChain = new LogChain(LogTools.info)
        errorChain.setNextChainNode(warnChain)
        warnChain.setNextChainNode(infoChain)
        return errorChain
    }
}
chainDemo()
// info - info log message.
// warn - warn log message.
// info - warn log message.
// error - error log message.
// warn - error log message.
// info - error log message.
```
#### AOP实现职责链

结合JavaScript函数式编程的特点，可以很灵活地实现一个职责链，缺点是闭包保存了各级函数的作用域，当链较长时会导致性能问题

```JavaScript
const LogTools = {
    error: {
        level: 3,
        log(level, message) {
            if (this.level <= level) {
                console.error(`error - ${message}`)
            }
        }
    },
    warn: {
        level: 2,
        log(level, message) {
            if (this.level <= level) {
                console.warn(`warn - ${message}`)
            }
        }
    },
    info: {
        level: 1,
        log(level, message) {
            if (this.level <= level) {
                console.log(`info - ${message}`)
            }
        }
    }
}

Function.prototype.after = function(logTool) {
    let _self = this
    return function(...args) {
        _self.apply(null, args)
        logTool.log.apply(logTool, args)
    }
}

var logChain = LogTools.error.log.bind(LogTools.error)
    .after(LogTools.warn).after(LogTools.info)

logChain(1, 'info log msg.')
logChain(2, 'warn log msg.')
logChain(3, 'error log msg.')
```
### 中介者模式

中介者模式（Mediator Pattern）是用来降低多个对象和类之间的通信复杂性。这种模式提供了一个中介类，该类通常处理不同类之间的通信，它封装了一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

中介者模式使对象间通信由网状图变为星型图
![示意图](mediator-pattern-1.png)

示例：4v4红蓝方对局游戏，当一方全部阵亡时，另一方胜利；游戏期间，队员阵亡播报信息通知每个队员

```JavaScript
//队员类
function Player(name, teamColor) {
    this.name = name
    this.teamColor = teamColor
    this.state = 'alive'
}
//暴露给中介者接口
Player.prototype.win = function() {
    console.log(this.name, ' won')
}

Player.prototype.lose = function() {
    console.log(this.name, ' lost')
}

//--------------------------------
//通知中介者接口
Player.prototype.die = function() {
    this.state = 'dead'
    playerCenter.receiveMsg('playerDead', this)
}

//工厂类
function PlayerFactory(name, teamColor) {
    let player = new Player(name, teamColor)
    playerCenter.receiveMsg('playerAdd', player) //通知中介者新增队员
    return player
}

var playerCenter = (function (){
    let _player = {} //中介者负责和所有队员交互
    let _operate = {}   //内部方法

    _operate.playerAdd = function(player) {
        let teamColor = player.teamColor
        _player[teamColor] = _player[teamColor] || []
        _player[teamColor].push(player)
    }

    _operate.playerDead = function(player) {
        let teamColor = player.teamColor
        let allDead = true
        let teamPlayers = _player[teamColor]
        allDead = teamPlayers.every(player => {
            return player.state === 'dead'
        })
        if (allDead) {
            teamPlayers.forEach(player => {
                player.lose()
            })
            Object.keys(_player).forEach(color => {
                if (color !== teamColor) {
                    _player[color].forEach(player => {
                        player.win()
                    })
                }
            })
        }
    }
    //外部方法
    var receiveMsg = function() {
        let msgType = [].shift.apply(arguments)
        _operate[msgType].apply(this, arguments)
    }
    return {    //暴露消息接口
        receiveMsg
    }
})()

var play1 = PlayerFactory('老王', 'blue')
var play2 = PlayerFactory('老李', 'blue')
var play3 = PlayerFactory('老蔡', 'blue')
var play4 = PlayerFactory('老白', 'blue')

var play5 = PlayerFactory('小王', 'red')
var play6 = PlayerFactory('小李', 'red')
var play7 = PlayerFactory('小蔡', 'red')
var play8 = PlayerFactory('小白', 'red')

//test
play1.die()
play2.die()
play3.die()
play4.die()
//result
// 老王  lost
// 老李  lost
// 老蔡  lost
// 老白  lost
// 小王  won
// 小李  won
// 小蔡  won
// 小白  won
```
### 装饰者模式

装饰器模式（Decorator Pattern）允许向一个现有的对象动态添加新的功能，同时又不改变其结构;
这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供额外功能

#### 模拟传统Java语言实现

```JavaScript
//画圆类
function DrawCircle(radius) {
    this.radius = radius
}

DrawCircle.prototype.draw = function() {
    console.log('circle - ', 'radius - ', this.radius)
}

var circle = new DrawCircle(2)
circle.draw()   //circle -  radius -  2

//现在需要画圆并且指定颜色
function DecoratorDrawCircle(drawCircle) {
    this.drawCircle = drawCircle
}

//装饰类接口和被装饰类接口保持一致，对用户透明化，用户不感知是否使用了装饰类
//包装类间可以继续包装，形成包装链
DecoratorDrawCircle.prototype.draw = function(color) {
    this.drawCircle.draw()
    console.log('绘制指定颜色 - ', color)
}

var circleD = new DecoratorDrawCircle(new DrawCircle(3))
circleD.draw('red') 
// circle -  radius -  3
// 绘制指定颜色 -  red
```
#### 装饰器函数

JavaScript中更多的是面向函数，需要在不改变原有函数情况下，动态增加新功能

```JavaScript
//AOP装饰函数
Function.prototype.after = function(fn) {
    let _self = this
    return function() {
        _self.apply(this, arguments)    //this会一直传递，不会发生this劫持
        fn && (fn.apply(this, arguments))
    }
}

Function.prototype.before = function(fn) {
    let _self = this
    return function() {
        fn && (fn.apply(this, arguments))
         _self.apply(this, arguments)
    }
}

//公共函数模块
var  public = function() {
    console.log('public - ', arguments, this.role)
}

//扩展功能-执行公共模块前增加操作日志打印
Log = {
    role: 'admin',
    log(action) {
        console.log('role - ', this.role, 'action - ', action)
    }
}
Log.log = public.before(Log.log)
Log.log('delete items')
// role -  admin action -  delete items
// public - delete items - admin
```
