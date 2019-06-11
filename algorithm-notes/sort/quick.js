const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

/**
 * 基本快排： 寻找切分点，切分点左边均不大于，切分点右边均不小于，两个子数组排序好了整个数组就有序了
 * @param {*} _arr 
 */
function quick(_arr = arr) {
    _sort(0, _arr.length - 1)
    function _sort(lo, hi) {
        if (hi <= lo) return
        let j = _partition(lo, hi)
        _sort(lo, j-1)
        _sort(j+1, hi)
    }
    //左右开始扫描，左边不小于切点的和右边不大于切点的交换
    function _partition(lo, hi) {
        let i = lo, j = hi+1
        let v = _arr[lo]
        while(true) {
            while(_arr[++i] < v) if(i == hi) break
            while(v < _arr[--j]) if(j == lo) break
            if (i >= j) break
            _exch(i, j)
        }
        _exch(lo, j)
        return j
    }
    function _exch(i, j) {
        let tmp = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = tmp
    }
}

/* quick()
console.log('quick', arr) */

/**
 * 三向切分快排：维护三个指针lt, i, gt 其中[lo, lt-1]小于切点 [lt, i-1]等于切点 [i, gt]未知待比较 [gt+1, hi]大于切点
 * @param {*} _arr 
 */
function quick3way(_arr = arr) {
    _sort(0, _arr.length - 1)

    function _sort(lo, hi) {
        if (hi <= lo) return
        let lt = lo, i = lo + 1, gt = hi
        let v = _arr[lo]
        while(i <= gt) {
            //扫描比较 数组分成了三部分，再排序子数组
            if (_arr[i] < v) _exch(i++, lt++)
            else if (_arr[i] > v) _exch(i, gt--)
            else i++
        }
        _sort(lo, lt-1)
        _sort(gt+1, hi)
    }

    function _exch(i, j) {
        let tmp = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = tmp
    }
}

quick3way()
console.log('quick3way', arr)
