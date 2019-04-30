export default {

    toSwaggerOas(json) {
        let res = {}
        this._contructOas(res, json)
        return res
    },
    _contructOas(output, input){
        if(input instanceof Object){
            output.type = 'object'
            output.properties = {}
            output = output.properties

            let keys = Object.keys(input)
            keys.forEach(key => {
                this._assignVal(output[key] = {}, input[key])
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
    }

}
