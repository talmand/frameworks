class People extends React.Component {
    constructor (props) {
        super(props);

        this.person = this.props.person;
    }
    age (birthDate) {
        let date = new Date(birthDate);
        let diff = new Date().getTime() - date.getTime();

        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    editDrawer (person) {
        this.props.editDrawerParent(person);
    }
    render () {
        return (
            <section>
                <p>{this.person.firstName} {this.person.lastName} was born on {new Date(this.person.birthDate).toDateString()} in {this.person.birthPlace}. {this.person.firstName} currently lives in {this.person.currentHome} and is {this.age(this.person.birthDate)} years old.</p>
                <button className="edit" onClick={e => this.editDrawer(this.person)}>✎</button>
            </section>
        );
    }
};

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            list: [],
            drawerTitle: '',
            drawerList: {
                birthDate: '',
                birthPlace: '',
                currentHome: '',
                firstName: '',
                lastName: ''
            }
        };

        this.editDrawer = this.editDrawer.bind(this);
        this.saveEditDrawer = this.saveEditDrawer.bind(this);
        this.drawerSaveClickHandler = this.drawerSaveClickHandler.bind(this);
        this.drawerDeleteClickHandler = this.drawerDeleteClickHandler.bind(this);
        this.drawerListOnChange = this.drawerListOnChange.bind(this);
    }
    componentDidMount () {
        this.getData();
    }
    hideDrawer (val) {
        document.querySelector('body').classList.toggle('hide-drawer', val);
    }
    getData () {
        fetch('http://localhost:3000/people')
            .then(response => {
                return response.json();
            }).then(json => {
                this.setState({
                    list: json
                });
            }).catch(e => {
                console.error(e);
            });
    }
    editDrawer (person) {
        this.hideDrawer(false);
        this.setState({
            drawerTitle: 'Edit',
            drawerList: person
        });
    }
    saveEditDrawer () {
        fetch('http://localhost:3000/people/' + this.state.drawerList.id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.drawerList)
            }).then(e => {
                this.hideDrawer(true);
                this.getData();
            }).catch(e => {
                console.error(e);
            });
    }
    createDrawer () {
        this.hideDrawer(false);
        this.setState({
            drawerTitle: 'Create New',
            drawerList: {
                birthDate: '',
                birthPlace: '',
                currentHome: '',
                firstName: '',
                lastName: ''
            }
        });
    }
    saveCreateDrawer () {
        fetch('http://localhost:3000/people/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.drawerList)
            }).then(() => {
                this.hideDrawer(true);
                this.getData();
            }).catch(e => {
                console.error(e);
            });
    }
    drawerSaveClickHandler (id) {
        id !== undefined ? this.saveEditDrawer() : this.saveCreateDrawer();
    }
    drawerDeleteClickHandler (id) {
        fetch('http://localhost:3000/people/' + id, {
                method: 'delete'
            }).then(() => {
                this.hideDrawer(true);
                this.getData();
            }).catch(e => {
                console.error(e);
            });
    }
    drawerListOnChange (e) {
        let type = e.target.dataset.type;
        let val = e.target.value;
        
        this.state.drawerList[type] = val;
    }
    render () {
        return (
            <div>
                <section id="panel">
                    <button className="create" onClick={() => this.createDrawer()}>create</button>
                </section>
                <main id="people">
                    {this.state.list.map((item, index) => {
                        return <People person={item} key={index} editDrawerParent={this.editDrawer} />
                    })}
                </main>
                <section id="drawer" data-type={this.state.drawerTitle === 'Edit' ? 'edit' : 'create'}>
                    <header>
                        <h2>{this.state.drawerTitle}</h2>
                        <button className="close" onClick={() => this.hideDrawer(true)}>×</button>
                    </header>
                    <article>
                        <p><input type="text" placeholder="First Name" data-type="firstName" defaultValue={this.state.drawerList.firstName} onChange={this.drawerListOnChange} /> <input type="text" className="last-name-input" placeholder="Last Name" data-type="lastName" defaultValue={this.state.drawerList.lastName} onChange={this.drawerListOnChange} /> was born on <input type="date" className="birth-date-input" placeholder="Birth Date" data-type="birthDate" defaultValue={this.state.drawerList.birthDate} onChange={this.drawerListOnChange} /> in <input type="text" className="birthplace-input" placeholder="Birthplace" data-type="birthPlace" defaultValue={this.state.drawerList.birthPlace} onChange={this.drawerListOnChange} /> and currently lives in <input type="text" className="current-home-input" placeholder="Current Home" data-type="currentHome" defaultValue={this.state.drawerList.currentHome} onChange={this.drawerListOnChange} />.</p>
                    </article>
                    <footer>
                        <button className="save" onClick={() => this.drawerSaveClickHandler(this.state.drawerList.id)}>✓ save</button>
                        <button className="delete" onClick={() => this.drawerDeleteClickHandler(this.state.drawerList.id)}>✗ delete</button>
                    </footer>
                </section>
                <div id="drawer_overlay" onClick={() => this.hideDrawer(true)}></div>
            </div>
        );
    }
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);