/*
* ChangeObserver digunakan untuk memantau attribute yang diedit dan
* mentrigger SEKALI SAJA parent yang menerapkan mixin ini,
* atau yang memiliki fungsi $_changeObserverMixin_onDataChanged
* **/
export default {
    props : {
        $_changeObserverMixin_ParentCallback : {//fungsi $_changeObserverMixin_onDataChanged dari parent
            type : Function
        }
    },
    data : () => ({
        $_changeObserverMixin_unwatchFunctions : [],//list fungsi untuk unwatch key
        $_changeObserverMixin_wasTriggered : false//penanda agar ditrigger sekali saja
    }),
    methods : {
        //menghapus listener/observer
        $_changeObserverMixin_unObserve : function () {
            this.$_changeObserverMixin_wasTriggered = false
            this._data.$_changeObserverMixin_unwatchFunctions.forEach(fn => fn())
            this._data.$_changeObserverMixin_unwatchFunctions.length = 0
        },
        //inisiasi observer, @watchList berisi list dari key @data yang akan di observe
        $_changeObserverMixin_initObserver : function (watchList = []) {
            this.$_changeObserverMixin_wasTriggered = false
            //hapus unwatch list
            this.$_changeObserverMixin_unObserve()
            let attr = watchList
            for(let i = 0; i < attr.length; i++){
                this._data.$_changeObserverMixin_unwatchFunctions.push(
                    this.$watch(attr[i],this.$_changeObserverMixin_onDataChanged)
                )
            }
        },
        //fungsi yang akan dipanggil ketika key yang diobserve diedit
        $_changeObserverMixin_onDataChanged : function () {
            if(!this.$_changeObserverMixin_wasTriggered && this.$_changeObserverMixin_ParentCallback !== undefined){
                this.$_changeObserverMixin_unObserve()
                this.$_changeObserverMixin_ParentCallback()
            }
            this.$_changeObserverMixin_wasTriggered = true
        }
    }
}