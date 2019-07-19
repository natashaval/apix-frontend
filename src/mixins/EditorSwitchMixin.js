import {EditorHeader} from "@/utils/GlobalVars";

export default {
    name: "RedirectMixin",
    methods : {
        $_EditorSwitch_changeRouteHandler : function (changeRouteCallback) {
            if(EditorHeader.isEditing){
                this.$toast.question('There are unsaved changes. Would you like to discard or save?',
                    'Unsaved changes', {
                        timeout: 20000,
                        close: true,
                        overlay: true,
                        toastOnce: true,
                        id: 'question',
                        zindex: 999,
                        position: 'center',
                        buttons: [
                            ['<button>Discard changes</button>', (instance, toast) => {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
                                EditorHeader.cancel()
                                changeRouteCallback()
                            }, true],
                            ['<button><b>Save and continue</b></button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
                                EditorHeader.submit()
                                changeRouteCallback()
                            }]
                        ]
                    })
            }
            else{
                changeRouteCallback()
            }
        }
    }
}
