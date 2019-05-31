/*
 * @Description: React Component test demo 
 * @Author: your name
 * @Date: 2019-05-30 20:51:13
 * @LastEditTime: 2019-05-31 15:11:02
 * @LastEditors: Please set LastEditors
 */
jest
    .dontMock('../src/component/Button/Button.jsx')
    .dontMock('classnames')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'
// import TestUtils from 'react-addons-test-utils'

import Button from '../src/component/Button/Button.jsx'

describe('render a button', () => {
    it('change text after click', () => {
        const button = ReactTestUtils.renderIntoDocument(
            <div>
              <Button>
                Hello
              </Button>
            </div>
          );
        expect(ReactDOM.findDOMNode(button).children[0].nodeName).toEqual('BUTTON');

        const a = ReactTestUtils.renderIntoDocument(
            <div>
              <Button href="#">
                Hello
              </Button>
            </div>
          );
          expect(ReactDOM.findDOMNode(a).children[0].nodeName).toEqual('A');
    })

    it('allows custom CSS classes', () => {
        const button = ReactTestUtils.renderIntoDocument(
          <div><Button className="good bye">Hello</Button></div>
        );
        const buttonNode = ReactDOM.findDOMNode(button).children[0];
        expect(buttonNode.getAttribute('class')).toEqual('Button good bye');
    });
})
