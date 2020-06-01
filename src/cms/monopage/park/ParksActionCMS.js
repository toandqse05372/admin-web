import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddParkRequest, actUpdateParkRequest, actGetParkRequest } from '../../../actions/index';

class ParksActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtCity: '',
            txtOpenHours: '',
            txtPhoneNumber: '',
            txtDescription: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditPark(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.itemEditing){
            var {itemEditing} = nextProps;
            this.setState({
                id : itemEditing.id,
                txtName : itemEditing.name,
                txtDescription : itemEditing.description,
                txtPrice : itemEditing.price,
                chkbStatus : itemEditing.status
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
        var { id, txtName, txtDescription, txtCity, txtOpenHours, txtPhoneNumber } = this.state;
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
        var { txtName, txtDescription, txtCity, txtOpenHours, txtPhoneNumber } = this.state;
        return (
            <div className="container">
                        <form onSubmit={this.onSubmit}>
                            <legend>* Vui lòng nhập đầy đủ thông tin</legend>
                            <div className="form-group">
                                <label>Park name </label>
                                <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>City </label>
                                <textarea onChange={this.onChange} value={txtCity} name="txtCity" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Open hours </label>
                                <input onChange={this.onChange} value={txtOpenHours} name="txtOpenHours" type="number" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Phone number </label>
                                <input onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="number" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Description </label>
                                <input onChange={this.onChange} value={txtDescription} name="txtDescription" type="number" className="form-control" />
                            </div>
                            <Link to="/parks" className="btn btn-danger mr-5">
                                <i className="glyphicon glyphicon-arrow-left"></i> Trở Lại
                            </Link>
                            <button type="submit" className="btn btn-primary">
                                <i className="glyphicon glyphicon-save"></i> Lưu Lại
                            </button>
                        </form>
                    </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        itemEditing : state.itemEditing
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddPark: (park) => {
            dispatch(actAddParkRequest(park));
        },
        onUpdatePark: (park) => {
            dispatch(actUpdateParkRequest(park));
        },
        onEditPark : (id) => {
            dispatch(actGetParkRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParksActionCMS);
