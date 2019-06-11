/**
 * 基于堆的优先队列: 二叉堆每个节点{k:键值, v:value} 每个节点元素不小于子节点 优先队列ADT堆顶永远是最大元素，总是可以执行insert和delMax
 */
class MaxPQ {
    constructor(len) {
        this.pq = new Array(len)    //优先队列
        this.N = 0  //队列大小
    }
    isEmpty() {
        return this.N == 0
    }
    size() {
        return this.N
    }
    insert(v) {
        this.pq[++this.N] = v
        this._swim(this.N)
    }
    //上浮元素
    _swim(k) {
        while(k > 1 && this._less(k/2, k)) {
            this._exch(k/2, k)
            k = (k/2)>>0
        } 

    }
    //比较两元素大小
    _less(k1, k2) {
        return this.pq[k1>>0] < this.pq[k2>>0]
    }
    //交换元素
    _exch(k1, k2) {
        let tmp = this.pq[k1>>0]
        this.pq[k1>>0] = this.pq[k2>>0]
        this.pq[k2>>0] = tmp
    }
    delMax() {
        let v = this.pq[1]
        this._exch(1, this.N)
        this.pq[this.N--] = null
        this._sink(1)
        return v
    }
    //下沉元素
    _sink(k) {
        while(2*k <= this.N) {
            let i = 2*k
            if(i < this.N && this._less(i, i+1)) i++
            if(!this._less(k, i)) break
            this._exch(k, i)
            k = i
        }
    }
}

const arr = [1, 90, 233, 33, 5, 2, 1, 9, 3, 4]
const len = arr.length + 1
const maxPQ = new MaxPQ(len)

arr.forEach(v => {
    maxPQ.insert(v)
})

//通过优先队列进行排序
const result = []
while(!maxPQ.isEmpty()) {
    result.push(maxPQ.delMax())
}
console.log('优先队列', result.reverse())
