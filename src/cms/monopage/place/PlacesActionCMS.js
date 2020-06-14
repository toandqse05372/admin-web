import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddPlaceRequest, actUpdatePlaceRequest, actGetPlaceRequest, actFetchPlaceTypesRequest } from '../../../actions/indexPlaces';
import { actFetchCitiesRequest } from '../../../actions/indexCities';
import { Form, FormControl } from 'react-bootstrap'

class PlacesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            drbCity: '',
            drbPlaceType: '', 
            txtPhoneNumber: '',
            txtDescription: '',
            txtOpenHours: '',
        };
    }

    componentDidMount() {
        this.props.fetchAllCities();
        this.props.fetchAllPlaceTypes();
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditPlace(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.name,
                drbCity: itemEditing.city == null ? "" :itemEditing.city.id,
                drbPlaceType: itemEditing.PlaceType == null ? "" :itemEditing.PlaceType[0].id,
                txtDescription: itemEditing.description,
                txtPhoneNumber: itemEditing.phoneNumber,
                txtOpenHours: itemEditing.openHours,  
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
        var { id, txtName, txtDescription, txtCity, txtOpenHours, txtPhoneNumber, drbPlaceType } = this.state;
        var Place = {
            id: id,
            name: txtName,
            cityName: txtCity,
            shortDescription: txtDescription,
            openHours: txtOpenHours,
            phoneNumber: txtPhoneNumber
        };
        if (id) {
            this.props.onUpdatePlace(Place);
        } else {
            this.props.onAddPlace(Place);
        }
        this.props.history.goBack();
    }

    render() {
        var { txtName, txtDescription, drbCity, txtOpenHours, txtPhoneNumber, drbCity, drbPlaceType } = this.state;
        var { cities, placeTypes } = this.props
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Vui lòng nhập đầy đủ thông tin</legend>
                    <div className="form-group">
                        <label>Tên địa điểm </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Tỉnh / Thành </label>
                        <Form.Control as="select"
                            name="drbCity"
                            value={drbCity}
                            onChange={this.onChange}>
                            <option key={0} index={0} value={0}>-- Chọn Tỉnh / Thành --</option>
                            {this.showCities(cities)}
                        </Form.Control>
                    </div>
                    <div>
                        <label>Loại </label>
                        <Form.Control as="select"
                            name="drbPlaceType"
                            value={drbPlaceType}
                            onChange={this.onChange}>
                            <option key={0} index={0} value={0}>-- Chọn loại --</option>
                            {this.showPlaceTypes(placeTypes)}
                        </Form.Control>
                        
                    </div>
                    {/* <div className="form-group">
                        <label>Open hours </label>
                        <TimePicker/>
                    </div> */}
                    <div className="form-group">
                        <label>Số điện thoại </label>
                        <input onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="number" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Giới thiệu </label>
                        <textarea onChange={this.onChange} value={txtDescription} name="txtDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label>Chọn file ảnh </label>
                        <FormControl id="formControlsFile"
                            type="file"
                            multiple
                            label="File" />
                    </div>
                    <br/>
                    <Link to="/Places" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Trở lại
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Lưu địa điểm
                            </button>
                </form>
            </div>
        );
    }

    showCities(cities) {
        var result = null;
        if (cities.length > 0) {
            result = cities.map((cities, index) => {
                return <option key={index} index={index} value={cities.id}>{cities.name}</option>
            });
        }
        return result;
    }

    showPlaceTypes(placeTypes) {
        var result = null;
        if (placeTypes.length > 0) {
            result = placeTypes.map((placeTypes, index) => {
                return <option key={index} index={index} value={placeTypes.id}>{placeTypes.placeTypeName}</option>
            });
        }
        return result;
    }
}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing,
        cities: state.cities,
        placeTypes: state.placeTypes,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddPlace: (place) => {
            dispatch(actAddPlaceRequest(place, props.history));
        },
        onUpdatePlace: (place) => {
            dispatch(actUpdatePlaceRequest(place, props.history));
        },
        onEditPlace: (id) => {
            dispatch(actGetPlaceRequest(id));
        },
        fetchAllCities: () => {
            dispatch(actFetchCitiesRequest());
        },
        fetchAllPlaceTypes: () => {
            dispatch(actFetchPlaceTypesRequest());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesActionCMS);
