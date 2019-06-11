const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

/**
 * 插入排序：执行length-1趟，只有当选择的插入点小于左边才执行两两交换
 * @param {*} _arr 
 */
function insertion(_arr = arr) {
    for (let i = 1; i < _arr.length; i++) {
        for (let j = i; j > 0 && (_arr[j] < _arr[j-1]); j--) {
            let tmp = _arr[j-1]
            _arr[j-1] = _arr[j]
            _arr[j] = tmp
        }
    }
}
insertion()
console.log('insertion', arr)
