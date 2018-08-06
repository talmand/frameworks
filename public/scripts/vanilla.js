var main = (function () {
    const public = {};
    const _people = document.querySelector('#people');
    const _drawer = document.querySelector('#drawer');

    var _age = function (birthDate) {
        let date = new Date(birthDate);
        let diff = new Date().getTime() - date.getTime();

        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    public.get = function () {
        fetch('http://localhost:3000/people')
            .then(response => {
                return response.json();
            }).then(json => {
                public.list = [];
                Array.prototype.slice.call(json).forEach(element => {
                    public.list.push(element);
                });
                public.updateAll();
            }).catch(e => {
                console.error(e);
            });
    };

    public.put = function (e) {
        let birthDate = document.querySelector('#drawer .birth-date-input').value;
        let birthPlace = document.querySelector('#drawer .birthplace-input').value;
        let currentHome = document.querySelector('#drawer .current-home-input').value;
        let firstName = document.querySelector('#drawer .first-name-input').value;
        let lastName = document.querySelector('#drawer .last-name-input').value;

        fetch('http://localhost:3000/people/' + _drawer.dataset.id, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "birthDate": birthDate,
                "birthPlace": birthPlace,
                "currentHome": currentHome,
                "firstName": firstName,
                "lastName": lastName
            })
        }).then(() => {
            public.list.forEach((element, key) => {
                if (element.id === parseInt(_drawer.dataset.id)) {
                    public.list[key].firstName = firstName;
                    public.list[key].lastName = lastName;
                    public.list[key].birthDate = birthDate;
                    public.list[key].birthPlace = birthPlace;
                    public.list[key].currentHome = currentHome;
                }
            });

            drawer.hide();
            public.update(_drawer.dataset.id);
        }).catch(e => {
            console.error(e);
        });
    };

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
    };

    public.updateAll = function () {
        let html = '';

        public.list.forEach(element => {
            html += `
                <section data-id="${element.id}">
                    <p>${element.firstName} ${element.lastName} was born on ${new Date(element.birthDate).toDateString()} in ${element.birthPlace}. ${element.firstName} currently lives in ${element.currentHome} and is ${_age(element.birthDate)} years old.</p>
                    <button class="edit">✎</button>
                </section>`;
        });

        _people.innerHTML = html;
    };

    public.update = function (id) {
        let section = document.querySelector(`section[data-id="${id}"] p`);
        let current = main.list.filter(element => element.id === parseInt(id)).pop();

        section.innerHTML = `${current.firstName} ${current.lastName} was born on ${new Date(current.birthDate).toDateString()} in ${current.birthPlace}. ${current.firstName} currently lives in ${current.currentHome} and is ${_age(current.birthDate)} years old.`;
    };

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
    };

    public.create = function () {
        drawer.show('Create New');

        _drawer.dataset.id = '';
        _drawer.dataset.type = 'create';
        document.querySelector('#drawer .birth-date-input').value = '';
        document.querySelector('#drawer .birthplace-input').value = '';
        document.querySelector('#drawer .current-home-input').value = '';
        document.querySelector('#drawer .first-name-input').value = '';
        document.querySelector('#drawer .last-name-input').value = '';
    };

    return public;
})();

var drawer = (function () {
    const public = {};

    public.show = function (title) {
        document.querySelector('#drawer header h2').innerText = title;
        document.body.classList.remove('hide-drawer');
    };

    public.hide = function () {
        document.body.classList.add('hide-drawer');
    };

    public.update = function (id, type) {
        let current = main.list.filter(element => element.id === parseInt(id)).pop();
        
        document.querySelector('#drawer').dataset.id = current.id;
        document.querySelector('#drawer').dataset.type = type;
        document.querySelector('#drawer .birth-date-input').value = current.birthDate;
        document.querySelector('#drawer .birthplace-input').value = current.birthPlace;
        document.querySelector('#drawer .current-home-input').value = current.currentHome;
        document.querySelector('#drawer .first-name-input').value = current.firstName;
        document.querySelector('#drawer .last-name-input').value = current.lastName;
    };

    return public;
})();

var buttons = (function () {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit')) {
            drawer.update(e.target.parentElement.dataset.id, 'edit');
            drawer.show('Edit');
        }
    });

    document.querySelector('#panel .create').addEventListener('click', main.create);

    document.querySelector('#drawer_overlay').addEventListener('click', drawer.hide);
    document.querySelector('#drawer .close').addEventListener('click', drawer.hide);
    document.querySelector('#drawer .delete').addEventListener('click', main.delete);
    document.querySelector('#drawer .save').addEventListener('click', function () {
        let type = document.querySelector('#drawer').dataset.type;

        if (type === 'edit') {
            main.put();
        }
        if (type === 'create') {
            main.post();
        }
    });
})();

main.get();