// https://stackoverflow.com/questions/54430191/how-to-separate-the-methods-of-a-vue-component-in-an-external-js-file

function makeToast(variant, success, message){
    this.$bvToast.toast(message, {
        title: (success) ? 'Success' : 'Failed',
        variant: variant
    })
}

export {makeToast}