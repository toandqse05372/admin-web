import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, InputGroup } from 'react-bootstrap'
import { connect } from 'react-redux';
import ParkItem from './components/ParkItem';
import ParkList from './components/ParkList';
import { actFetchParksRequest, actDeleteParkRequest } from '../../../actions/indexParks';

class ParksCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtParkName :'',
            paramBody : {
                name: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.props.fetchAllParks(this.state.paramBody);
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody : {
                name: value,
                page: 1,
                limit: 10,
            }
        })
        
    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.props.fetchAllParks(this.state.paramBody);
    }

    render() {
        const { txtParkName } = this.state;
        var { parks } = this.props;
        return (
            <div className="container span14">
                <Form onSubmit={this.onSubmitSearch} >
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Search"
                            name="txtParkName"
                            value={txtParkName}
                            onChange={this.onChange}
                        />
                    </InputGroup>
                    <Button
                        type="Submit"
                        variant="outline-success">
                        Search
                    </Button>
                </Form>
                <Link to="/parks/add" className="btn btn-primary mb-5 ">
                    <i className="glyphicon glyphicon-plus"></i> Add Park
                </Link>
                <ParkList>
                    {this.showParks(parks)}
                </ParkList>
            </div>
        );
    }

    showParks(parks) {
        var result = null;
        var { onDeletePark } = this.props;
        if (parks.length > 0) {
            result = parks.map((parks, index) => {
                return <ParkItem parks={parks} key={index} index={index} onDeletePark={onDeletePark} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        parks: state.parks
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllParks: (paramBody) => {
            dispatch(actFetchParksRequest(paramBody));
        },
        onDeletePark: (id) => {
            dispatch(actDeleteParkRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParksCMS);