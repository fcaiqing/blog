const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

/**
 * 归并排序：将大数组不断拆分连个小规模数组排序，然后合并两个有序数组
 * @param {*} _arr 
 */
function merge(_arr = arr) {
    const result = Array.prototype.slice.call({length: _arr.length})
    sort(0, _arr.length - 1)
    //合并两个有序数组
    function _merge(lo, mid, hi) {
        let i = lo, j = mid + 1
        _arr.forEach((n, i) => {
            result[i] = n
        });
        for (let k = lo; k <= hi; k++) {
            if (i > mid) _arr[k] = result[j++]
            else if (j > hi) _arr[k] = result[i++]
            else if (result[j] < result[i]) _arr[k] = result[j++]
            else _arr[k] = result[i++] 
        }
    }
    //数组排序
    function sort(lo, hi) {
        if (hi <= lo) return
        let mid = lo + ((hi - lo)/2) << 0
        sort(lo, mid)
        sort(mid+1, hi)
        _merge(lo, mid, hi)
    }
}

merge()
console.log('merge', arr)
