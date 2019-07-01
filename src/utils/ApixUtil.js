export default {

    isEqualArray(arr1, arr2, ignoredField){
        arr1.sort()
        arr2.sort()
        let len = arr1.length
        for(let i = 0; i < len; ++i){
            let val1 = arr1[i]
            let val2 = arr2[i]

            if(typeof val1 !== typeof val2){
                return false
            }
            else if(val1 instanceof Array){
                if(!this.isEqualArray(val1, val2, ignoredField)){
                    return false
                }
            }
            else if(val1 instanceof Object){
                if(!this.isEqualObject(val1, val2, ignoredField)){
                    return false
                }
            }
            else if(val1 !== val2){
                return false
            }
        }
        return true
    },
    isEqualObject(obj1, obj2,ignoredField = []){
        let keys1 = Object.keys(obj1)
        let keys2 = Object.keys(obj2)
        keys1 = keys1.filter(key => !(ignoredField.includes(key)))
        keys2 = keys1.filter(key => !(ignoredField.includes(key)))
        if(keys1.length !== keys2.length)return false

        let keyLen = keys1.length
        for(let i = 0; i < keyLen; i++){
            let key = keys1[i]
            let val1 = obj1[key]
            let val2 = obj2[key]
            if(val1 === undefined ^ val2 === undefined){
                return false
            }
            if(typeof val1 !== typeof val2){
                return false
            }
            else if(val1 instanceof Array){
                if(!this.isEqualArray(val1,val2, ignoredField)){
                    return false
                }
            }
            else if(val1 instanceof Object){
                if(!this.isEqualObject(val1, val2, ignoredField)){
                    return false
                }
            }
            else{
                if(val1 !== val2){
                    console.error('key : '+key)
                    console.error('obj1['+key+'] = '+val1)
                    console.error('obj2['+key+'] = '+val2)
                    return false
                }
            }
        }
        return true
    },

    isEqualObjectByKeys : function (obj1, obj2, keys) {
        for(let key of keys){
            if(obj1[key] !== obj2[key])return false
        }
        return true
    }

}
