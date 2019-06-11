/**
 * 堆排序: 将任意数组变成堆有序
 */
function heap(_arr = arr) {
    let N = _arr.length
    _sort()
    function _sort() {
        //二叉树扫描一半成堆有序
        for (let k = (N/2)>>0; k >=1; k--) {
            _sink(k)
        }
        //堆有序后依次删除第一个元素
        while(N > 1) {
            _exch(1, N--)
            _sink(1)
        }
    }
    function _sink(k) {
        while(2*k <= N) {
            let i = 2*k
            if (i < N && _less(i, i+1)) i++
            if(!_less(k, i)) break
            _exch(k, i)
            k =i
        }
    }
    function _less(k1, k2) {
        return _arr[k1-1] < _arr[k2-1]
    }
    function _exch(k1, k2) {
        let tmp = _arr[k1-1]
        _arr[k1-1] = _arr[k2-1]
        _arr[k2-1] = tmp
    }
}

const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

heap()
console.log('heap堆排序', arr)
