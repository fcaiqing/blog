import React, {Component} from "react"
import classNames from 'classnames'

export default class Button extends Component {
    render() {
        const props = this.props
        return (
            props.href
                ? <a {...props} className={classNames('Button', props.className)}></a>
                : <button {...props} className={classNames('Button', props.className)}></button>
        )
    }
}
