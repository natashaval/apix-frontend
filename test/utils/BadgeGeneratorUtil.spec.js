import BadgeGeneratorUtil from "@/utils/BadgeGeneratorUtil.js"

describe ('badge test', () =>{
    test('method get should return badge success', () => {
        expect(BadgeGeneratorUtil.getBadgeClassOfOperation("get")).toEqual('badge badge-success')
    })

    test('method post should return badge warning', () => {
        expect(BadgeGeneratorUtil.getBadgeClassOfOperation("post")).toEqual('badge badge-warning')
    })

    test('method put should return badge info', () => {
        expect(BadgeGeneratorUtil.getBadgeClassOfOperation("put")).toEqual('badge badge-info')
    })

    test('method delete should return badge danger', () => {
        expect(BadgeGeneratorUtil.getBadgeClassOfOperation("delete")).toEqual('badge badge-danger')
    })
})