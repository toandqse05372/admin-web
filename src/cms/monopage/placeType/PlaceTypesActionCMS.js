import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddPlaceTypeRequest, actUpdatePlaceTypeRequest, actGetPlaceTypeRequest } from '../../../actions/indexPlaceTypes';
import { Form } from 'react-bootstrap'

class PlaceTypesActionCMS extends Component {

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
            this.props.onGetPlaceType(id)
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
            this.props.onUpdatePlaceType(city);
        } else {
            this.props.onAddPlaceType(city);
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
                    <div className="form-group">
                        <Form.File.Input />
                    </div>
                    <Link to="/cities" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Trở lại
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Lưu loại địa điểm
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
        onAddPlaceType: (city) => {
            dispatch(actAddPlaceTypeRequest(city, props.history));
        },
        onUpdatePlaceType: (city) => {
            dispatch(actUpdatePlaceTypeRequest(city, props.history));
        },
        onGetPlaceType: (id) => {
            dispatch(actGetPlaceTypeRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceTypesActionCMS);
