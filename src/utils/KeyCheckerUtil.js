export default {
    validateKey : function (key) {
        if(this.isReservedKeyword(key)){
            return {
                isValid : false,
                message : key + ' is reserved keyword'
            }
        }

        if(key.search('\\.') !== -1){
            return {
                isValid : false,
                message : 'key can\'t contain dot'
            }
        }
        return {
            isValid : true
        }
    },
    isReservedKeyword : function (key) {
        switch (key) {
            case '_actions':
                return true
            case '_signature':
                return true
        }
        return false
    }

}
