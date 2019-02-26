export default {
    isEqual(obj1,obj2) {
        if(obj1 instanceof Array){
            if(obj1.length !== obj2.length)return false
            for(let i in obj1){
                if(obj1[i] != obj2[i])return false
            }
            return true
        }
        let obj1Empty = obj1 === undefined || obj1 === null || obj1 === ''
        let obj2Empty = obj2 === undefined || obj2 === null || obj2 === ''

        return (obj1 == obj2) || (obj1Empty && obj2Empty)
    },
    _getCopy(obj){
      if(obj instanceof Array){
          return Object.assign([],obj)
      }
      else if(obj instanceof Object){
          return Object.assign({},obj)
      }
      return obj
    },
    // contoh @keyList
    // [
    //     {keyBefore : 'X',keyAfter:'x', default :''},
    //     {keyBefore : 'y',keyAfter:'Y', default : 99},
    // ]
    createActions(objBefore, objAfter, keyList) {
        let actions = []

        if(objBefore === undefined){
            objBefore = {}
        }

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
            // console.log(before+' '+after+' '+keys.default)
            if(before === undefined){
                // console.log('masyukk')
                if(!this.isEqual(after, keys.default)){
                    actions.push({
                        action : 'put',
                        key : (keys.key === undefined)?keys.keyBefore:keys.key,
                        value : this._getCopy(after)
                    })
                }
            }
            else if(!this.isEqual(before,after)){
                actions.push({
                    action : 'put',
                    key : (keys.key === undefined)?keys.keyBefore:keys.key,
                    value : this._getCopy(after)
                })
            }
        }
        return actions
    }

}