const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

/**
 * 选择排序： 比较length - 1趟，每趟选择最小的一个
 * @param {*} _arr 
 */
function sort(_arr = arr) {
    for (let i = 0; i < _arr.length; i++) {
        let min = i
        for (let j = i + 1; j < _arr.length; j++) {
            if (_arr[j] < _arr[min]) {
                let tmp = _arr[min]
                _arr[min] = _arr[j]
                _arr[j] = tmp
            }
        }
    }
}
/* sort()
console.log(arr) */

/**
 * 冒泡算法： 执行length-1趟，每趟从左开始两两比较
 * @param {*} _arr 
 */
function bubble(_arr = arr) {
    for (let i = _arr.length -1 ; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (_arr[j] > _arr[j+1]) {
                let tmp = _arr[j+1]
                _arr[j+1] = _arr[j]
                _arr[j] = tmp
            }
        }
    }
}
bubble()
console.log('bubble', arr)
