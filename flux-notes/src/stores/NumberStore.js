import {EventEmitter} from 'events'
import AppDispatcher from '../dispatcher/dispatcher.js'
import {ACTION_TYPE} from '../actions/actionTypes.js'
const em = new EventEmitter()

export const NumberStore = {
    number: 10,
    getNumber() {
        return this.number
    },
    _add() {
        this.number++
    },
    _minus() {
        this.number--
    },
    emitChange: function () {
        em.emit('change');
    },
    addChangeListener(callback) {
        em.on('change', callback);
    },
    removeChangeListener: function(callback) {
        em.removeListener('change', callback);
    }
}

AppDispatcher.register(function (action) {
    switch (action.type) {
        case ACTION_TYPE.ADD:
            NumberStore._add();
            NumberStore.emitChange();
            break;
        case ACTION_TYPE.MINUS:
            NumberStore._minus();
            NumberStore.emitChange();
            break;
        default:

    }
})
