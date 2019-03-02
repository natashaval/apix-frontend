export default {
    executeActions(target,actions){
        let len = actions.length
        for(let i = 0; i < len; i++){
            let key = actions[i].key
            let val = actions[i].value
            switch (actions[i].action) {
                case 'put' :
                    delete target[key]
                    target[key] = val
                    break
                case 'rename' :
                    target[actions[i].newKey] = target[key]
                    delete target[key]
                    break
                case 'delete' :
                    delete target[key]
            }
        }
    }
}