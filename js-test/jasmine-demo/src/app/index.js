/*
 * @Description: jasmine使用示例
 * @Author: your name
 * @Date: 2019-05-30 16:53:15
 * @LastEditTime: 2019-05-30 17:39:44
 * @LastEditors: cq
 */

export function getPersonName(name) {
    const result = {}
    const reg = /(\w+) (\w+) (\w+)/;
    reg.test(name);
    return Object.assign(result, {
        first: RegExp.$1,
        middle: RegExp.$2,
        last: RegExp.$3
    })
}
