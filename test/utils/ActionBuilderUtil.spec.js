import ActionBuilderUtil from "@/utils/ActionBuilderUtil";
import ApixUtil from "../../src/utils/ApixUtil";


describe('isEqual() tests', () => {

    test('undefined === null === <empty string> test',() => {
        expect(ActionBuilderUtil.isEqual(undefined,'')).toBeTruthy()
        expect(ActionBuilderUtil.isEqual(null, '')).toBeTruthy()
    })

    test('array test', () => {
        expect(ActionBuilderUtil.isEqual([1,2,3],[1,2,3])).toBeTruthy()
        expect(ActionBuilderUtil.isEqual([1,2,3],[1,3,2])).toBeFalsy()
        expect(ActionBuilderUtil.isEqual([1,2,3],[1,2,3,4])).toBeFalsy()
    })

})

describe('createActions() tests',() => {

    let obj1 = {
        'key1' : 1,
        'key2' : 'value 2',
        'key3' : 'value 3',
        'key4' : 'value 4',
        'key5a' : 'value 5',
    }

    let obj2 = {
        'key1' : 2,
        'key2' : 'value 2',
        'key3' : 'value 3',
        'key4' : 'new value 4',
        'key5b' : 'value 5',
    }


    test('should return non-empty test', () => {
        expect(
            ActionBuilderUtil.createActions(
                obj1, obj2,['key1','key2',{key : 'key3'}]
            ).length
        ).toEqual(1)
    })

    test('should return empty test', () => {
        let result = ActionBuilderUtil.createActions(
            obj1, obj2,['key1','key2',{key : 'key3'}]
        )

        expect(
            result.length
        ).toEqual(1)
        console.log(result)
        expect(
            ApixUtil.isEqualArray(result,[{
                action : 'put',
                key : 'key1',
                value : 2
            }])
        ).toBeTruthy()

        expect(
            ActionBuilderUtil.createActions(
                obj1, obj2,['key1','key2',{keyBefore : 'key5a',keyAfter : 'key5b'}]
            ).length
        ).toEqual(1)
    })

})
