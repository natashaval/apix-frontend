export default {

    toSwaggerOas(json) {
        let res = {}
        this._contructOas(res, json)
        return res
    },
    _contructOas(output, input){
        if(!(input instanceof Array) && input instanceof Object){
            output.type = 'object'
            output.properties = {}
            output = output.properties

            let keys = Object.keys(input)
            keys.forEach(key => {
                this._assignVal(output[key] = {name: key}, input[key])
            })
        }
        else{
            this._assignVal(output, input)
        }
    },
    _assignVal(output, val){
        if(typeof val === 'string'){
            output.type = 'string'
            output.default = val
        }
        else if(typeof val === 'number'){
            output.type = 'number'
            output.default = val
        }
        else if(typeof val === 'boolean'){
            output.type = 'boolean'
            output.default = val
        }
        else if(val instanceof Array){
            output.type = 'array'
            if(val.length > 0){
                output.items = {}
                this._contructOas(output.items, val[0])
            }
        }
        else if(val instanceof Object){
            this._contructOas(output, val)
        }
    },
    replaceValueWithKey(target, targetKey, targetValDict){
        if(target instanceof Object && !(target instanceof Array)){
            let keys = Object.keys(target)
            if(keys){
                keys.forEach(key => {
                    let val = target[key]
                    if(key === targetKey){
                        if(targetValDict[val] !== undefined){
                            target[key] = targetValDict[val]
                        }
                        else{
                            console.log(key)
                            console.log(target[key])
                            console.log(targetValDict[key])
                            throw 'Invalid $ref'
                        }
                    }
                    else{
                        if(val instanceof Array){
                            val.forEach(v => this.replaceValueWithKey(v, targetKey, targetValDict) )
                        }
                        else if(val instanceof Object){
                            this.replaceValueWithKey(val, targetKey, targetValDict)
                        }
                    }
                })
            }
        }
    }

}
