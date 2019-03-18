import Vue from "vue";

export default {
    executeActions(target,actions){
        let len = actions.length
        for(let i = 0; i < len; i++){
            let key = actions[i].key
            let val = actions[i].value
            switch (actions[i].action) {
                case 'put' :
                    if(target[key] !== undefined)Vue.delete(target,key)
                    Vue.set(target,key,val)
                    break
                case 'rename' :
                    Vue.set(target,actions[i].newKey, Object.assign({}, target[key]))
                    Vue.delete(target,key)
                    break
                case 'delete' :
                    Vue.delete(target,key)
                    break
            }
        }
    }
}