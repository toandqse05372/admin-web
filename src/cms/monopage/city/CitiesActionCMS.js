import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddCityRequest, actUpdateCityRequest, actGetCityRequest } from '../../../actions/indexCities';
import { FormControl } from 'react-bootstrap'

class CitiesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtShortDescription: '',
            txtDetailDescription: '',
            fileImage: null
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
        var value = name === 'fileImage' ? target.files[0] : target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtName, txtShortDescription, txtDetailDescription, fileImage } = this.state;
        var city = {
            id: id,
            name: txtName,
            shortDescription: txtShortDescription,
            detailDescription: txtDetailDescription
        };
        let data = new FormData();
        if (fileImage !== null && typeof fileImage !== "undefined") {
            data.append('file', fileImage, fileImage.name);
        }
        data.append('city', JSON.stringify(city));
        if (id) {
            this.props.onUpdateCity(data, id);
        } else {
            this.props.onAddCity(data);
        }
    }

    render() {
        var { txtName, txtShortDescription, txtDetailDescription, fileImage } = this.state;
        var { match } = this.props
        return (
            <div className="container">
                <h1> {match ? 'Update city': 'Add new city'} </h1>
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>City Name *</label>
                        <input required onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
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
                    <div className="form-group">
                        <label>Choose image file </label>
                        <FormControl id="formControlsFile"
                            type="file"
                            label="File"
                            name="fileImage"
                            onChange={this.onChange} />
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
        onUpdateCity: (city, id) => {
            dispatch(actUpdateCityRequest(city, props.history, id));
        },
        onEditCity: (id) => {
            dispatch(actGetCityRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesActionCMS);
