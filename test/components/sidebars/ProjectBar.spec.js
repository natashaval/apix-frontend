import {createLocalVue, shallowMount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import ProjectBar from "@/components/sidebars/ProjectBar.vue"
import ProjectEditor from "../../../src/components/editors/ProjectEditor";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import flushPromises from 'flush-promises';
import {BASE_PROJECT_URL} from "../../../src/stores/actions/const";
// import SwaggerClient from "../../../src/components/editors/SwaggerClient";

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueRouter)

const routes = [
    {name: 'project-editor', path: '/projects/:projectId', component: ProjectEditor },
    {name: 'swagger-client', path: '/projects/:projectId/swagger'}
]
const router = new VueRouter({routes})

describe('project side bar', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(ProjectBar, {
            localVue,
            router,
            propsData: {
                apiData: {
                    "id": "project-id",
                    "basePath": "/v2",
                    "host": "petstore.swagger.io",
                    "info": {
                        "description": "This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.",
                        "version": "1.0.0",
                        "title": "Swagger Petstore",
                        "termsOfService": "http://swagger.io/terms/"
                    }
                }
            },
            stubs: {
                'router-link': true,
                // 'BButton': true
                // 'b-button': {
                //     template: `<button @click='$listeners.click'></button>`
                // }
            },
        })
    })

    test('should show project title name', () => {
        let elem = wrapper.find('h4')
        expect(elem.text()).toEqual('Swagger Petstore')
        expect(elem.classes()).toContain('text-center')
    })

    test('click project title and should route push', () => {
        let elem = wrapper.find('h4')
        elem.trigger('click')
        expect(wrapper.vm.$route.name).toEqual('project-editor')
        expect(wrapper.vm.$route.path).toEqual('/projects/project-id')
        expect(wrapper.vm.$route.params.projectId).toEqual('project-id')
    })

    test('try client axios and should give file export location', async () => {
        // https://vue-test-utils.vuejs.org/guides/testing-async-components.html
        var mock = new MockAdapter(axios);
        const data = {
            "success": true,
            "message": "",
            "file_url": "/download/exported-oas/mock-export-oas.json"
        }
        mock.onPost(BASE_PROJECT_URL + '/project-id' + '/export?type=oas-swagger2&format=JSON')
            .reply(200, data);
        let elem = wrapper.find('[name="swagger-client"]');
        elem.trigger('click')
        await flushPromises()
        expect(wrapper.vm.fileExportLocation).toEqual('/download/exported-oas/mock-export-oas.json')
    })

    test('click on swagger client and should move to swagger page', async () => {
        var mock = new MockAdapter(axios);
        const data = {
            "success": true,
            "message": "",
            "file_url": "/download/exported-oas/mock-export-oas.json"
        }
        mock.onPost(BASE_PROJECT_URL + '/project-id' + '/export?type=oas-swagger2&format=JSON')
            .reply(200, data);
        let elem = wrapper.find('[name="swagger-client"]');
        elem.trigger('click')
        await flushPromises();
        expect(wrapper.vm.$route.name).toEqual('swagger-client')
        expect(wrapper.vm.$route.params.projectId).toEqual('project-id')
        expect(wrapper.vm.$route.params.fileUrl).toEqual('/download/exported-oas/mock-export-oas.json')
    })
})