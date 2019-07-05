export default {
    getBadgeClassOfOperation(operation){
        switch (operation) {
            case "get":
            case "head":
            case "option":
                return 'badge badge-success'
            case "post":
            case "patch":
                return 'badge badge-warning'
            case "put":
                return 'badge badge-info'
            case "delete":
                return 'badge badge-danger'
        }
    }
}