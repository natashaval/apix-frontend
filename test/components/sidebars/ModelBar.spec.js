import {createLocalVue, shallowMount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import ModelBar from "@/components/sidebars/ModelBar.vue"
import DefinitionEditor from "../../../src/components/editors/DefinitionEditor";

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueRouter)

const routes = [
    {name: 'definition-editor', path: '/projects/:projectId/definitions/:definitionApi', component: DefinitionEditor}
]

describe('model bar unit test', () => {
    let wrapper
    const router = new VueRouter({routes})

    beforeEach(() => {
        wrapper = shallowMount(ModelBar, {
            localVue,
            router,
            propsData: {
                definitionApi: 'Definition',
                definitionKey: 'def-123',
                projectApi: 'project-id',
                editable : true
            },
            stubs: {
                'router-link': true,
            },
        })
    })

    test('should show model name', () => {
        let elem = wrapper.find('[name="definitionApi"]')
        expect(elem.text()).toEqual('Definition')
        expect(elem.classes()).toContain('shrinkable-text')
    })

    test('click model and should route push', () => {
        let elem = wrapper.find('[name="definitionApi"]')
        elem.trigger('click')
        expect(wrapper.vm.$route.name).toEqual('definition-editor')
        expect(wrapper.vm.$route.path).toEqual('/projects/project-id/definitions/Definition')
        expect(wrapper.vm.$route.params.definitionApi).toEqual('Definition')
        expect(wrapper.vm.$route.params.projectId).toEqual('project-id')
    })
})