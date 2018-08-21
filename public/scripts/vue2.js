var store = {
    debug: true,
    state: {
        list: [],
        drawerPerson: {},
        drawerTitle: 'Edit',
        drawerType: 'edit'
    },
    updateList () {
        fetch('http://localhost:3000/people')
            .then(response => {
                return response.json();
            }).then(json => {
                this.state.list = json;
                this.clearDrawerPerson();
            }).catch(e => {
                console.error(e);
            });
    },
    editPerson (id) {
        fetch('http://localhost:3000/people/' + id, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.drawerPerson)
        }).then(() => {
            let index = this.state.list.findIndex(x => x.id === id);

            this.state.list.splice(index, 1, this.state.drawerPerson);
            this.clearDrawerPerson();
        }).catch(e => {
            console.error(e);
        });
    },
    deletePerson (id) {
        fetch('http://localhost:3000/people/' + id, {
            method: 'delete'
        }).then(() => {
            let index = this.state.list.findIndex(x => x.id === id);

            this.state.list.splice(index, 1);
            this.clearDrawerPerson();
        }).catch(e => {
            console.error(e);
        });
    },
    createPerson () {
        fetch('http://localhost:3000/people/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.drawerPerson)
        }).then(() => {
            this.updateList();
        }).catch(e => {
            console.error(e);
        });
    },
    clearDrawerPerson () {
        this.state.drawerPerson = {
            birthDate: '',
            birthPlace: '',
            currentHome: '',
            firstName: '',
            lastName: '',
            id: null
        };
    }
};

Vue.component('people-list', {
    template: '#people_list_template',
    props: ['person'],
    methods: {
        editButton: function () {
            vm.$emit('EditDrawer', this.person.id);
        },
        age: function (birthDate) {
            let date = new Date(birthDate);
            let diff = new Date().getTime() - date.getTime();
    
            return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        },
        birthString: function (birthDate) {
            return new Date(birthDate).toDateString();
        }
    }
});

Vue.component('drawer', {
    template: '#drawer_template',
    props: ['person', 'title', 'type'],
    methods: {
        hideDrawer: function (val) {
            document.body.classList.toggle('hide-drawer', val);
        },
        saveButton: function () {
            store.state.drawerType === 'edit' ? store.editPerson(this.person.id) : store.createPerson();
            this.hideDrawer(true);
        },
        deleteButton: function () {
            store.deletePerson(this.person.id);
            this.hideDrawer(true);
        }
    }
});

var vm = new Vue({
    el: '#app',
    data: {
        sharedState: store.state
    },
    methods: {
        hideDrawer: function (val) {
            document.body.classList.toggle('hide-drawer', val);
        },
        editDrawer: function (id) {
            let index = this.sharedState.list.findIndex(x => x.id === id);

            this.sharedState.drawerPerson = Object.assign({}, this.sharedState.list[index]);
            this.sharedState.drawerTitle = 'Edit';
            this.sharedState.drawerType = 'edit';
            this.hideDrawer(false);
        },
        createDrawer: function () {
            store.clearDrawerPerson();
            this.sharedState.drawerTitle = 'Create New';
            this.sharedState.drawerType = 'create';
            this.hideDrawer(false);
        }
    },
    created: function () {
        store.updateList();
        this.$on('EditDrawer', id => this.editDrawer(id));
    }
});