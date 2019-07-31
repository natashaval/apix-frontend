import ActionExecutorUtil from "@/utils/ActionExecutorUtil"


describe('general test',() => {

    test('put operation test',()=>{
        let actions = [{
            action : 'put',
            key : 'key1',
            value : 'new value'
        }]
        let obj = {
            key1 : 'old value'
        }

        ActionExecutorUtil.executeActions(obj, actions)

        expect(obj.key1).toEqual('new value')
    })

    test('delete operation test', ()=>{
        let actions = [{
            action : 'delete',
            key : 'key1'
        }]

        let obj = {
            key1 : 'old value'
        }

        ActionExecutorUtil.executeActions(obj, actions)

        expect(obj.hasOwnProperty('key1')).toBeFalsy()
    })

    test('rename operation test', ()=>{
        let actions = [{
            action : 'rename',
            key : 'key1',
            newKey : 'key2'
        }]

        let obj = {
            key1 : 'old value'
        }

        ActionExecutorUtil.executeActions(obj, actions)

        expect(obj.hasOwnProperty('key1')).toBeFalsy()
        expect(obj.hasOwnProperty('key2')).toBeTruthy()
    })

})
