import React, {Component} from 'react'
import {Number} from './Number.jsx'
import AppDispatcher from '../../dispatcher/dispatcher.js'
import {ACTION_TYPE} from '../../actions/actionTypes.js'
import {NumberStore} from '../../stores/NumberStore.js'

export class NumberContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            number: NumberStore.getNumber()
        }
    }
    _add() {
        AppDispatcher.dispatch({
            type: ACTION_TYPE.ADD
        })
        NumberStore.addChangeListener(() => {
            this._update()
        })
    }
    _minus() {
        AppDispatcher.dispatch({
            type: ACTION_TYPE.MINUS
        })
        NumberStore.addChangeListener(() => {
            this._update()
        })
    }
    _update() {
        this.setState({
            number: NumberStore.getNumber()
        })
    }
    render() {
        return (
            <Number
                number={this.state.number}
                add={this._add.bind(this)}
                minus={this._minus.bind(this)}
            />
        )
    }
}
