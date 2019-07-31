/*
* ChangeObserver digunakan untuk recursive watch terhadap attribute lalu memanggil fungsi onDataChanged dari parent
* melalui object props $_changeObserverMixin_parent
* **/
import Vue from "vue"

export default {
    props : {
        $_changeObserverMixin_parent : {
            type : Object
        }
    },
    data : () => ({
        $_changeObserverMixin_unwatchFunctions : [],//list fungsi untuk unwatch key
        $_changeObserverMixin_wasTriggered : false,//penanda agar ditrigger sekali saja
        $_changeObserverMixin_validators : {},
        $_changeObserverMixin_childs : [],
        $_changeObserverMixin_childId : 0,
        $_changeObserverMixin_this_id : undefined,
    }),
    computed : {
        $_changeObserverMixin_this : function () {
            return {
                onDataChanged : this.$_changeObserverMixin_onDataChanged,
                addChild : this.$_changeObserverMixin_addChild,
                allIsValid : this.$_changeObserverMixin_allIsValid,
                deleteChild : this.$_changeObserverMixin_deleteChild,
                id : this.$vnode.tag
            }
        }
    },
    methods : {
        $_changeObserverMixin_deleteChild : function (id) {
            let childs = this._data.$_changeObserverMixin_childs
            this._data.$_changeObserverMixin_childs = childs.filter(child => child.id !== id)
        },
        //return index
        $_changeObserverMixin_addChild : function (child) {
            this._data.$_changeObserverMixin_childs.push({
                id : this._data.$_changeObserverMixin_childId,
                methods : child
            })
            return this._data.$_changeObserverMixin_childId++
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

                    Vue.set(this._data.$_changeObserverMixin_validators,attr[i].model,attr[i].validator)
                }
            }
        },
        $_changeObserverMixin_getErrors : function (name) {
            if(this._data.$_changeObserverMixin_validators[name] === undefined)return []
            let errors = this._data.$_changeObserverMixin_validators[name]()
            return errors
        },
        $_changeObserverMixin_allIsValid : function () {
            let isValid = true
            let validators = this._data.$_changeObserverMixin_validators
            for(let key in validators){
                isValid &= (validators[key]().length === 0)
                if(!isValid){
                    return false
                }
            }

            let childs = this._data.$_changeObserverMixin_childs
            for(let i in childs){
                isValid &= childs[i].methods.allIsValid()
            }
            return isValid
        },
        $_changeObserverMixin_isValid : function (key) {
            if(this._data.$_changeObserverMixin_validators[key] === undefined)return true
            return this._data.$_changeObserverMixin_validators[key]().length === 0
        },
        //fungsi yang akan dipanggil ketika key yang diobserve diedit
        $_changeObserverMixin_onDataChanged : function (after, before) {
            if(!this.$_changeObserverMixin_wasTriggered && this.$_changeObserverMixin_parent !== undefined){
                this.$_changeObserverMixin_unObserve()
                if(before === undefined && after === undefined)return
                this.$_changeObserverMixin_parent.onDataChanged(after, before)
            }
            this.$_changeObserverMixin_wasTriggered = true
        },
        $_changeObserverMixin_selfDelete : function () {
            if(this._props.$_changeObserverMixin_parent !== undefined){
                this.$_changeObserverMixin_parent.deleteChild(this.$_changeObserverMixin_this_id)
            }
        }
    },
    created() {
        if(this._props.$_changeObserverMixin_parent !== undefined){
            let p = this.$_changeObserverMixin_parent
            this.$_changeObserverMixin_this_id = p.addChild(this.$_changeObserverMixin_this)
        }
    },
    beforeDestroy() {
        this.$_changeObserverMixin_selfDelete()
    }
}
