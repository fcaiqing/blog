### module定义

文件即module，exports代表对外导出接口，初次加载执行后续读取缓存，清理缓存后才会重新执行

### module构成

下面是打印的module具体内容

```JavaScript
this is commonjs module,  Module {
  id: '.',
  exports:
   { person: { getName: [Function: getName], getAge: [Function: getAge] } },
  parent: null,
  filename: 'D:\\vscode\\mystudy\\CommonJS\\example.js',
  loaded: false,
  children:
   [ Module {
       id: 'D:\\vscode\\mystudy\\CommonJS\\person.js',
       exports: [Object],
       parent: [Circular],
       filename: 'D:\\vscode\\mystudy\\CommonJS\\person.js',
       loaded: true,
       children: [],
       paths: [Array] } ],
  paths:
   [ 'D:\\vscode\\mystudy\\CommonJS\\node_modules',
     'D:\\vscode\\mystudy\\node_modules',
     'D:\\vscode\\node_modules',
     'D:\\node_modules' ] }
```

### CommonJS处理循环加载

当出现模块间循环加载时，Node会直接返回模块的不完整版本

### module加载机制

+ module导入的值是module导出值的拷贝，模块内部变化不能影响已经导出的值

```JavaScript
// main.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```
+ require的内部处理机制

>require命令是CommonJS规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的module.require命令，而后者又调用Node的内部命令Module._load。
```JavaScript
Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
};
```
>上面的第4步，采用module.compile()执行指定模块的脚本，逻辑如下。
```JavaScript
Module.prototype._compile = function(content, filename) {
  // 1. 生成一个require函数，指向module.require
  // 2. 加载其他辅助方法到require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
};
```
>上面的第1步和第2步，require函数及其辅助方法主要如下。

1. require(): 加载外部模块
2. require.resolve()：将模块名解析到一个绝对路径
3. require.main：指向主模块
4. require.cache：指向所有缓存的模块
5. require.extensions：根据文件的后缀名，调用不同的执行函数

>一旦require函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。该函数的参数包括require、module、exports，以及其他一些参数。
```JavaScript
(function (exports, require, module, __filename, __dirname) {
  // YOUR CODE INJECTED HERE!
});
```
>Module._compile方法是同步执行的，所以Module._load要等它执行完成，才会向用户返回module.exports的值。
