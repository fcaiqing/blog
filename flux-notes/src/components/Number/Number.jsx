import React, {Component} from 'react'

export class Number extends Component {
    render() {
        return (
            <div className='number'>
                <span>{this.props.number}</span>
                <button onClick={this.props.add}>add</button>
                <button onClick={this.props.minus}>minus</button>
            </div>
        )
    }
}
