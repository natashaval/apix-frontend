/*
* ChangeObserver digunakan untuk memantau attribute yang diedit dan
* mentrigger SEKALI SAJA parent yang menerapkan mixin ini
* atau parent yang memiliki fungsi $_changeObserverMixin_onDataChanged
* **/
export default {
    props : {
        $_changeObserverMixin_ParentCallback : {//fungsi $_changeObserverMixin_onDataChanged dari parent
            type : Function
        },
        $_changeObserverMixin_parent : {
            type : Object
        }
    },
    data : () => ({
        $_changeObserverMixin_unwatchFunctions : [],//list fungsi untuk unwatch key
        $_changeObserverMixin_wasTriggered : false,//penanda agar ditrigger sekali saja
        $_changeObserverMixin_validators : {},
        $_changeObserverMixin_childs : [],
        $_changeObserverMixin_this_index : undefined,
    }),
    computed : {
        $_changeObserverMixin_this : function () {
            return {
                onDataChanged : this.$_changeObserverMixin_onDataChanged,
                addChild : this.$_changeObserverMixin_addChild,
                allIsValid : this.$_changeObserverMixin_allIsValid,
                deleteChild : this.$_changeObserverMixin_deleteChild
            }
        }
    },
    methods : {
        $_changeObserverMixin_deleteChild : function (i) {
            this._data.$_changeObserverMixin_childs.splice(i, 1)
        },
        //return index
        $_changeObserverMixin_addChild : function (child) {
            this._data.$_changeObserverMixin_childs.push(child)
            return this._data.$_changeObserverMixin_childs - 1
        },
        //menghapus listener/observer
        $_changeObserverMixin_unObserve : function () {
            this.$_changeObserverMixin_wasTriggered = false
            this._data.$_changeObserverMixin_unwatchFunctions.forEach(fn => fn())
            this._data.$_changeObserverMixin_unwatchFunctions.length = 0
            delete this.$_changeObserverMixin_childs
            this.$_changeObserverMixin_childs = []
        },
        //inisiasi observer, @watchList berisi list dari key @data yang akan di observe
        $_changeObserverMixin_initObserver : function (watchList = []) {
            this.$_changeObserverMixin_wasTriggered = false
            //hapus unwatch list
            this.$_changeObserverMixin_unObserve()
            let attr = watchList
            for(let i = 0; i < attr.length; i++){
                if( typeof attr[i] === 'string' || attr[i] instanceof String){
                    this._data.$_changeObserverMixin_unwatchFunctions.push(
                        this.$watch(attr[i],this.$_changeObserverMixin_onDataChanged)
                    )
                }
                else if(attr[i] instanceof Object){
                    let watcherCallback =  this.$_changeObserverMixin_onDataChanged

                    if(attr[i].callback !== undefined){
                        watcherCallback = attr[i].callback
                    }

                    this._data.$_changeObserverMixin_unwatchFunctions.push(
                        this.$watch(attr[i].model, watcherCallback)
                    )
                    this._data.$_changeObserverMixin_validators[attr[i].model] = attr[i].validator
                }
            }
        },
        $_changeObserverMixin_allIsValid : function () {
            let isValid = true
            let validators = this._data.$_changeObserverMixin_validators
            for(let key in validators){
                isValid &= validators[key]()
                if(!isValid)return false
            }

            let childs = this._data.$_changeObserverMixin_childs
            for(let i in childs){
                isValid &= childs[i].allIsValid()
            }
            return isValid
        },
        $_changeObserverMixin_isValid : function (key) {
            if(this._data.$_changeObserverMixin_validators[key] === undefined)return true
            return this._data.$_changeObserverMixin_validators[key]()
        },
        //fungsi yang akan dipanggil ketika key yang diobserve diedit
        $_changeObserverMixin_onDataChanged : function () {
            if(!this.$_changeObserverMixin_wasTriggered && this.$_changeObserverMixin_parent !== undefined){
                this.$_changeObserverMixin_unObserve()
                this.$_changeObserverMixin_parent.onDataChanged()

            }
            this.$_changeObserverMixin_wasTriggered = true
        }
    },
    created() {
        if(this._props.$_changeObserverMixin_parent !== undefined){
            let p = this.$_changeObserverMixin_parent
            this.$_changeObserverMixin_this_index = p.addChild(this.$_changeObserverMixin_this)
        }
    },
    beforeDestroy() {
        if(this._props.$_changeObserverMixin_parent !== undefined){
            this.$_changeObserverMixin_parent.deleteChild(this.$_changeObserverMixin_this_index)
        }
    }
}
