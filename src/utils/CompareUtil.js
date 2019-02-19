export default {
    isEqual(obj1,obj2) {
        if(obj1 instanceof Array){
            if(obj1.length !== obj2.length)return false
            for(let i in obj1){
                if(obj1[i] != obj2[i])return false
            }
            return true
        }
        return obj1 == obj2
    },
    // contoh @keyList
    // [
    //     {keyBefore : 'X',keyAfter:'x', default :''},
    //     {keyBefore : 'y',keyAfter:'Y', default : 99},
    // ]
    isChanged(objBefore, objAfter, keyList) {
        for(let keys of keyList){
            let before,after
            if(keys.key  === undefined){
                before = objBefore[keys.keyBefore]
                after = objAfter[keys.keyAfter]
            }
            else{
                before = objBefore[keys.key]
                after = objAfter[keys.key]
            }

            if(before === undefined){
                return !this.isEqual(after, keys.default)
            }
            if(!this.isEqual(before,after)) return true
        }
        return false
    }

}