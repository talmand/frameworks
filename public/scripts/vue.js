Vue.component('people-list', {
    props: ['person'],
    methods: {
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

var vm = new Vue({
    el: '#app',
    data: {
        body: document.querySelector('body'),
        drawerTitle: '',
        hideDrawer: true,
        currentDrawerIndex: null,
        list: [],
        drawerList: {
            birthDate: '',
            birthPlace: '',
            currentHome: '',
            firstName: '',
            lastName: ''
        }
    },
    methods: {
        getData: function () {
            fetch('http://localhost:3000/people')
                .then(response => {
                    return response.json();
                }).then(json => {
                    this.list = json;
                }).catch(e => {
                    console.error(e);
                });
        },
        editDrawer: function (id) {
            this.drawerTitle = 'Edit';
            this.hideDrawer = false;
            this.currentDrawerIndex = this.list.findIndex(x => x.id === id);
        },
        saveEdit: function (id) {
            this.hideDrawer = true;
            fetch('http://localhost:3000/people/' + id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.list[this.currentDrawerIndex])
            }).catch(e => {
                console.error(e);
            });
        },
        createDrawer: function () {
            this.drawerTitle = 'Create New';
            this.hideDrawer = false;
        },
        saveCreate: function () {
            fetch('http://localhost:3000/people/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.drawerList)
            }).then(() => {
                this.hideDrawer = true;
                this.getData();
            }).catch(e => {
                console.error(e);
            });
        },
        deleteBtnClick: function (id) {
            fetch('http://localhost:3000/people/' + id, {
                method: 'delete'
            }).then(() => {
                this.list.splice(this.currentDrawerIndex, 1);
                this.hideDrawer = true;

                if (this.list.length === 0) {
                    this.currentDrawerIndex = null;
                }
            }).catch(e => {
                console.error(e);
            });
        }
    },
    watch: {
        hideDrawer: function (val) {
            this.body.classList.toggle('hide-drawer', val);

            if (val) {
                this.currentDrawerIndex = null;
            }
        }
    },
    created: function () {
        this.getData();
    }
});