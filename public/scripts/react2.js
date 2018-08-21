// WORK IN PROGRESS

class People extends React.Component {
    constructor (props) {
        super(props);

        this.people = this.props.people;
    };

    editDrawer (person) {
        this.props.editDrawerParent(person);
    }

    render () {
        return (
            <main id="people">
                {this.people.map((item, index) => {
                    return <Person person={item} key={index} editDrawerParent={this.editDrawer} />
                })}
            </main>
        );
    };
};

class Person extends React.Component {
    constructor (props) {
        super(props);

        this.person = this.props.person;
    };

    age (birthDate) {
        let date = new Date(birthDate);
        let diff = new Date().getTime() - date.getTime();

        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

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
    };
};

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            people: []
        };
    };

    componentDidMount () {
        this.getData();
    }

    hideDrawer (val) {
        document.querySelector('body').classList.toggle('hide-drawer', val);
    }

    editDrawer (person) {
        console.log(person);
    }

    getData () {
        fetch('http://localhost:3000/people')
            .then(response => {
                return response.json();
            }).then(json => {
                this.setState({
                    people: json
                });
            }).catch(e => {
                console.error(e);
            });
    };

    render () {
        if (this.state.people.length) {
            return (
                <div>
                    <People people={this.state.people} editDrawerParent={this.editDrawer} />
                </div>
            );
        } else {
            return (
                <div>Loading...</div>
            );
        }
    };
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);