<template>
    <div>
        <div v-if="isCreator">
            <div class="row">
                <div class="col-md-12">
                    <div class="input-group my-2">
                        <input class="form-control" type="text"
                               v-model="searchMember" placeholder="Search member name ..."/>
                        <div class="input-group-append">
                            <span class="input-group-text"><i class="fa fa-search"></i> </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 column-3">
                    <ul v-for="(user, i) in filterMember" :key="i" class="fa-ul mb-0">
                        <!--https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list-->
                        <li v-if="user.grant"><span class="fa-li"><i class="fas fa-check-square"></i></span> {{user.username}}</li>
                        <li v-if="!user.grant"><span class="fa-li"><i class="far fa-square"></i></span> {{user.username}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-else>
            <!--You are not anything-->
            <div class="row">
                <div class="col-md-12">
                    <div class="input-group my-2">
                        <input class="form-control" type="text"
                               v-model="searchMember" placeholder="Search member name ..."/>
                        <div class="input-group-append">
                            <span class="input-group-text"><i class="fa fa-search"></i> </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 column-3">
                    <ul v-for="(member,i) in filterMember" :key="i">
                        <li v-if="member.grant">{{member.username}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TeamMember",
        props: {
            isCreator: Boolean,
            memberList: Array
        },
        computed: {
            filterMember() {
                if (this.searchMember == '') return this.memberList
                else return this.memberList.filter(u => u.username.toLowerCase().includes(this.searchMember.toLowerCase()))
            }
        },
        data: function () {
            return {
                searchMember: ''
            }
        }
    }
</script>

<style scoped>
    .column-3 {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
        column-gap: 2em;
    }
</style>