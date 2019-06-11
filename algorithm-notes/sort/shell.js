const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

/**
 * 改进的插入排序——希尔排序： 通过间距h进行排序，将数组变成h有序，然后不断改变h长度重复排序知道完成
 * @param {*} _arr 
 */
function shell(_arr = arr) {
    let N = _arr.length
    let h = 1
    while (h < Math.round(N/3)) h = 3*h + 1
    while (h >= 1) {
        //h有序数组排序
        for (let i = h; i < N; i++) {
            for (let j = i; j >= h && _arr[j] < _arr[j-h]; j -= h) {
                let tmp = _arr[j-h]
                _arr[j-h] = _arr[j]
                _arr[j] = tmp
            }
        }
        h = Math.round(h / 3)
    }
}

shell()
console.log('shell', arr)
