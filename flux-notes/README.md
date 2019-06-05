## Flux概述
---
Flux是一种设计模式，用来管理应用中的数据流，其最重要的概念就是单向数据流。当应用中的视图和数据模型相互交错，数据来源多样式，Flux能够使你更好的管理数据，使得应用逻辑清晰便于更好地维护和扩展。

## Flux组成部分
---
+ Dispatcher
+ Store
+ Action
+ View

## Dispatcher 
----
应用应该只包含一个**单例**的中心Dispatcher，它能够接受所有的actions，并且将这些actions分发到每一个在Dispatcher注册过的store。任何一个store都能够接收到每个action。

## Store
---
Store是一个应用中容纳数据的容器，通过向应用的Dispatcher注册，以便能够接受actions。Store中的数据只能通过发送Action，然后Store对其进行响应来改变。当Store中的数据发生变化时，Store便会emit一个"change" 事件。

## Actions
---
Actions描述了一个改变动作，决定了应用内部处理的API。其通常是一个简单的对象数据，包含如下数据类型
```javascript
{
    type: 'ADD_ITEM'    //描述发生的动作
    payload: 'xx'   //数据载荷
}
```

## Views
---
Stores中的数据将会在视图中展示，使用了stores中数据的视图必须要订阅来自store中的变化事件，以便数据变化时stores可以通知views进行更新

## Flux数据流模型
![Flow of data in Flux](./flux-data-flow-diagram.png)
---
## Flux使用demo

```
$ yarn install
$ yarn build
```
