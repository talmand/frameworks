// WORK IN PROGRESS

var store = (function () {
    const public = {};
    const _drawer = document.querySelector('#drawer');
    
    public.state = {
        people: []
    };

    public.get = function () {
        fetch('http://localhost:3000/people')
            .then(response => {
                return response.json();
            }).then(json => {
                this.state.people = json;
                people.updateAll();
            }).catch(e => {
                console.error(e);
            });
    }

    public.put = function () {
        let _birthDate = document.querySelector('#drawer .birth-date-input').value;
        let _birthPlace = document.querySelector('#drawer .birthplace-input').value;
        let _currentHome = document.querySelector('#drawer .current-home-input').value;
        let _firstName = document.querySelector('#drawer .first-name-input').value;
        let _lastName = document.querySelector('#drawer .last-name-input').value;
        let _currentDrawerIndex = store.state.people.findIndex(x => x.id === parseInt(_drawer.dataset.id));

        fetch('http://localhost:3000/people/' + _drawer.dataset.id, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "birthDate": _birthDate,
                "birthPlace": _birthPlace,
                "currentHome": _currentHome,
                "firstName": _firstName,
                "lastName": _lastName
            })
        }).then(() => {
            store.state.people[_currentDrawerIndex].firstName = _firstName;
            store.state.people[_currentDrawerIndex].lastName = _lastName;
            store.state.people[_currentDrawerIndex].birthDate = _birthDate;
            store.state.people[_currentDrawerIndex].birthPlace = _birthPlace;
            store.state.people[_currentDrawerIndex].currentHome = _currentHome;

            drawer.hide();
            people.update(_drawer.dataset.id);
        }).catch(e => {
            console.error(e);
        });
    }

    public.post = function () {
        fetch('http://localhost:3000/people/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "birthDate": document.querySelector('#drawer .birth-date-input').value,
                "birthPlace": document.querySelector('#drawer .birthplace-input').value,
                "currentHome": document.querySelector('#drawer .current-home-input').value,
                "firstName": document.querySelector('#drawer .first-name-input').value,
                "lastName": document.querySelector('#drawer .last-name-input').value
            })
        }).then(() => {
            drawer.hide();
            public.get();
        }).catch(e => {
            console.error(e);
        });
    }

    public.delete = function () {
        let id = _drawer.dataset.id;

        fetch('http://localhost:3000/people/' + id, {
            method: 'delete'
        }).then(() => {
            document.querySelector(`section[data-id="${id}"]`).remove();
            drawer.hide();
        }).catch(e => {
            console.error(e);
        });
    }

    return public;
})();

var drawer = (function () {
    const public = {};
    const _drawer = document.querySelector('#drawer');

    public.show = function (title, type, id) {
        document.querySelector('#drawer header h2').innerText = title;
        document.body.classList.remove('hide-drawer');
        _drawer.dataset.type = type;
        _drawer.dataset.id = id;
    }

    public.hide = function () {
        document.body.classList.add('hide-drawer');
    }

    public.createPerson = function () {
        public.show('Create New', 'create', '');

        document.querySelector('#drawer .birth-date-input').value = '';
        document.querySelector('#drawer .birthplace-input').value = '';
        document.querySelector('#drawer .current-home-input').value = '';
        document.querySelector('#drawer .first-name-input').value = '';
        document.querySelector('#drawer .last-name-input').value = '';
    };

    public.editPerson = function (id) {
        let person = store.state.people.filter(person => person.id === parseInt(id)).pop();
        
        public.show('Edit', 'edit', person.id);

        document.querySelector('#drawer .birth-date-input').value = person.birthDate;
        document.querySelector('#drawer .birthplace-input').value = person.birthPlace;
        document.querySelector('#drawer .current-home-input').value = person.currentHome;
        document.querySelector('#drawer .first-name-input').value = person.firstName;
        document.querySelector('#drawer .last-name-input').value = person.lastName;
    }

    document.querySelector('#drawer_overlay').addEventListener('click', public.hide);
    document.querySelector('#panel .create').addEventListener('click', public.createPerson);
    document.querySelector('#drawer .close').addEventListener('click', public.hide);
    document.querySelector('#drawer .delete').addEventListener('click', store.delete);
    document.querySelector('#drawer .save').addEventListener('click', function () {
        let type = _drawer.dataset.type;

        if (type === 'edit') {
            store.put();
        }
        if (type === 'create') {
            store.post();
        }
    });
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit')) {
            public.editPerson(e.target.parentElement.dataset.id);
        }
    });

    return public;
})();

var people = (function () {
    const public = {};
    const _people = document.querySelector('#people');

    var _age = function (birthDate) {
        let date = new Date(birthDate);
        let diff = new Date().getTime() - date.getTime();

        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    public.update = function (id) {
        let section = document.querySelector(`section[data-id="${id}"] p`);
        let person = store.state.people.filter(person => person.id === parseInt(id)).pop();

        section.innerHTML = `${person.firstName} ${person.lastName} was born on ${new Date(person.birthDate).toDateString()} in ${person.birthPlace}. ${person.firstName} currently lives in ${person.currentHome} and is ${_age(person.birthDate)} years old.`;
    }

    public.updateAll = function () {
        let html = '';

        store.state.people.forEach(person => {
            html += `
                <section data-id="${person.id}">
                    <p>${person.firstName} ${person.lastName} was born on ${new Date(person.birthDate).toDateString()} in ${person.birthPlace}. ${person.firstName} currently lives in ${person.currentHome} and is ${_age(person.birthDate)} years old.</p>
                    <button class="edit">✎</button>
                </section>`;
        });

        _people.innerHTML = html;
    }

    return public;
})();

var main = (function () {
    store.get();
})();