const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]

function merge(_arr = arr) {
    let N = _arr.length
    const result = Array.prototype.slice({length: N})
    //两两归并一对子数组，长度按照sz =1, 2, 4, 8, ...
    for (let sz = 1; sz < N; sz *= 2)
    {
        //一次处理各子数组
        for (let lo = 0; lo < N - sz; lo +=2*sz) {
            _merge(lo, lo + sz - 1, Math.min(lo + 2*sz -1, N-1))
        }
    }

    function _merge(lo, mid, hi) {
        let i = lo, j = mid + 1
        _arr.forEach((n, i) => {
            result[i] = n
        })
        for (let k = lo; k <= hi; k++) {
            if (i > mid) _arr[k] = result[j++]
            else if (j > hi) _arr[k] = result[i++]
            else if (result[j] < result[i]) _arr[k] = result[j++]
            else _arr[k] = result[i++] 
        }
    }

}
merge()
console.log('mergeBottomToTop', arr)
