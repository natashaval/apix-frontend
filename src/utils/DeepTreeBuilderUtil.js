export default {

    buildDeepTree(keyList){
        let root = {}
        let pointer = root
        for(let i=0; i < keyList.length; i++){
            pointer = pointer[keyList[i]] = {}
        }

        return {root : root, leaf : pointer}
    }

}