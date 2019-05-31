import {getPersonName} from '../app/index.js' 

describe('function test', function () {
    beforeEach(() => {
        console.log('start test index.js')
    })
    afterEach(() => {
        console.log('end test index.js')
    })
    it('get person name', function () {
        var result = {
            first: 'me',
            middle: 'you',
            last: 'they'
        }
        expect(result).toEqual(getPersonName('me you they'))
    })
    var foo = 'foo';
    it(' expect foo equal foo ', function(){
        expect(foo).toEqual('foo');
    });
})
