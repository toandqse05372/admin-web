import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddParkRequest, actUpdateParkRequest, actGetParkRequest, actFetchParkTypesRequest } from '../../../actions/indexParks';
import { Form } from 'react-bootstrap'
import Select from 'react-select'

class GamesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtCity: '',
            txtOpenHours: '',
            txtPhoneNumber: '',
            txtDescription: '',
            drbCity: '',
            drbParkType: ''
        };
    }

    componentDidMount() {
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
        const options = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
        ]
        var { txtName, txtDescription, drbCity, txtOpenHours, txtPhoneNumber, drbCity, drbParkType } = this.state;
        var { cities, parktypes } = this.props
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Vui lòng nhập đầy đủ thông tin</legend>
                    <div className="form-group">
                        <label>Tên trò chơi </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="myDiv">
                        <label>Công viên </label>
                        <div >
                        <Select options={options}/>
                        </div>
                        
                    </div>

                    <div className="form-group">
                        <label>Giới thiệu </label>
                        <textarea onChange={this.onChange} value={txtDescription} name="txtDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <Link to="/games" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Trở lại
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Lưu trò chơi
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
        parktypes: state.parktypes,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddPark: (park) => {
            dispatch(actAddParkRequest(park, props.history));
        },
        onUpdatePark: (park) => {
            dispatch(actUpdateParkRequest(park, props.history));
        },
        onEditPark: (id) => {
            dispatch(actGetParkRequest(id));
        },
        fetchAllParkTypes: () => {
            dispatch(actFetchParkTypesRequest());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesActionCMS);
