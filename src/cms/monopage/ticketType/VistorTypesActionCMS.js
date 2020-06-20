import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddCityRequest, actUpdateCityRequest, actGetCityRequest } from '../../../actions/indexCities';
import { Form } from 'react-bootstrap'

class CitiesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtShortDescription: '',
            txtDetailDescription: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditCity(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.name,
                txtShortDescription: itemEditing.shortDescription,
                txtDetailDescription: itemEditing.detailDescription
            })
        }
    }


    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtName, txtShortDescription, txtDetailDescription } = this.state;
        var city = {
            id: id,
            name: txtName,
            shortDescription: txtShortDescription,
            detailDescription: txtDetailDescription
        };
        if (id) {
            this.props.onUpdateCity(city);
        } else {
            this.props.onAddCity(city);
        }
    }

    render() {
        var { txtName, txtShortDescription, txtDetailDescription } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>City Name </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Short Description</label>
                        <textarea onChange={this.onChange} value={txtShortDescription} name="txtShortDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label>Detail Description</label>
                        <textarea onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <Link to="/cities" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Back
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Save City
                            </button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddCity: (city) => {
            dispatch(actAddCityRequest(city, props.history));
        },
        onUpdateCity: (city) => {
            dispatch(actUpdateCityRequest(city, props.history));
        },
        onEditCity: (id) => {
            dispatch(actGetCityRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesActionCMS);
