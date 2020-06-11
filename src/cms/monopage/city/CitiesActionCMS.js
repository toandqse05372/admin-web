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
            txtCity: '',
            txtOpenHours: '',
            txtPhoneNumber: '',
            txtDescription: '',
            drbCity:'',
            drbParkType:''
        };
    }

    componentDidMount(){
        this.props.fetchAllParkTypes();
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditPark(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.name,
                txtDescription: itemEditing.description,
                txtPhoneNumber: itemEditing.phoneNumber,
                txtOpenHours: itemEditing.openHours,
                txtCity: itemEditing.cityId
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
        var { id, txtName, txtDescription, txtCity, txtOpenHours, txtPhoneNumber, drbParkType } = this.state;
        var park = {
            id: id,
            name: txtName,
            cityName: txtCity,
            shortDescription: txtDescription,
            openHours: txtOpenHours,
            phoneNumber: txtPhoneNumber
        };
        if (id) {
            this.props.onUpdatePark(park);
        } else {
            this.props.onAddPark(park);
        }
        this.props.history.goBack();
    }

    render() {
        var { txtName, txtShortDescription, txtDetailDescription } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Vui lòng nhập đầy đủ thông tin</legend>
                    <div className="form-group">
                        <label>Tên tỉnh / thành </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>                  
                    <div className="form-group">
                        <label>Giới thiệu ngắn</label>
                        <textarea onChange={this.onChange} value={txtShortDescription} name="txtShortDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label>Giới thiệu chi tiết</label>
                        <textarea onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <Link to="/games" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Trở lại
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Lưu tỉnh / thành
                            </button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing,
        cities: state.cities,
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
