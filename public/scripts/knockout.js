var vm = function () {
    let self = this;
    let currentSelfIndex = null;

    self.list = ko.observableArray([]);
    self.drawerTitle = ko.observable('Edit');
    self.drawerType = ko.observable('edit');
    self.hideDrawer = ko.observable(true);
    self.drawerList = ko.observable({
        'birthDate': null,
        'birthPlace': null,
        'currentHome': null,
        'firstName': null,
        'id': null,
        'lastName': null   
    });

    self.age = function (birthDate) {
        let date = new Date(birthDate);
        let diff = new Date().getTime() - date.getTime();

        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };
    self.birthDateStr = function (birthDate) {
        return new Date(birthDate).toDateString();
    };

    self.editDrawer = function (data) {
        currentSelfIndex = self.list().findIndex(x => x.id === data.id);
        self.drawerTitle('Edit');
        self.drawerType('edit');
        self.hideDrawer(false);
        self.drawerList({
            'birthDate': data.birthDate,
            'birthPlace': data.birthPlace,
            'currentHome': data.currentHome,
            'firstName': data.firstName,
            'id': data.id,
            'lastName': data.lastName   
        });
    };
    self.saveEdit = function () {
        self.hideDrawer(true);
        self.list.replace(self.list()[currentSelfIndex], self.drawerList());

        fetch('http://localhost:3000/people/' + self.drawerList().id, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(self.drawerList())
        }).catch(e => {
            console.error(e);
        });
    };
    self.createDrawer = function () {
        self.drawerType('create');
        self.drawerTitle('Create New');
        self.drawerList({
            'birthDate': null,
            'birthPlace': null,
            'currentHome': null,
            'firstName': null,
            'id': null,
            'lastName': null  
        });
        self.hideDrawer(false);
    };
    self.saveCreate = function () {
        fetch('http://localhost:3000/people/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(self.drawerList())
        }).then(function() {
            self.refresh();
            self.hideDrawer(true);
        }).catch(e => {
            console.error(e);
        });
    };
    self.saveBtnClick = function (e) {
        self.drawerType() === 'edit' ? self.saveEdit() : self.saveCreate();
    };
    self.deleteBtnClick = function (e) {
        self.hideDrawer(true);

        fetch('http://localhost:3000/people/' + self.drawerList().id, {
            method: 'delete'
        }).then(function() {
            self.list.remove(self.list()[currentSelfIndex]);
        }).catch(e => {
            console.error(e);
        });
    };
    self.refresh = function () {
        fetch('http://localhost:3000/people')
            .then(response => {
                return response.json();
            }).then(json => {
                self.list([]);
                Array.prototype.slice.call(json).forEach(element => {
                    self.list.push(element);
                });            
            }).catch(e => {
                console.error(e);
            });
    };
    self.refresh();
};

ko.applyBindings(new vm());