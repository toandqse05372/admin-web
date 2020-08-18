import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddVisitorTypeRequest, actUpdateVisitorTypeRequest, actGetVisitorTypeRequest } from '../../../actions/indexVisitorTypes';
import { Form } from 'react-bootstrap'

class VisitorTypesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtProductCode: '',
            txtPrice: '',
            txtTicketTypeId: '',
            isUpdate: false
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onGetVisitorType(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.typeName,
                txtProductCode: itemEditing.typeKey,
                txtPrice: itemEditing.price,
                txtTicketTypeId: itemEditing.ticketTypeId,
                isUpdate: true
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
        var { id, txtName, txtProductCode, txtPrice, isUpdate, txtTicketTypeId } = this.state;
        var visitorType = {
            id: id,
            typeName: txtName,
            typeKey: txtProductCode,
            price: txtPrice,
            ticketTypeId: isUpdate ? txtTicketTypeId : this.props.location.state.id
        };
        let data = new FormData();
        data.append('placeId', localStorage.getItem('placeId'));
        data.append('visitorType', JSON.stringify(visitorType));
        if (id) {
            this.props.onUpdateVisitorType(data, id);
        } else {
            this.props.onAddVisitorType(data);
        }
    }

    render() {
        var { txtName, txtPrice, txtProductCode } = this.state;
        var { match } = this.props
        const data = match ? null : this.props.location.state
        return (
            <div className="container">
                <h1> {match ? 'Update visitor type': 'Add new visitor type'} </h1>
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>Type Name *</label>
                        <input required style={{ width: 350 }} onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Product Key *</label>
                        <input required style={{ width: 350 }} onChange={this.onChange} value={txtProductCode} name="txtProductCode" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Price *</label>
                        <input required min="0" style={{ width: 350 }} onChange={this.onChange} value={txtPrice} name="txtPrice" type="number" className="form-control" />
                        {`\t`}VNĐ
                    </div>
                    <Link to="/ticketTypes" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Back
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Save Visitor Type
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
        onAddVisitorType: (visitorType) => {
            dispatch(actAddVisitorTypeRequest(visitorType, props.history));
        },
        onUpdateVisitorType: (visitorType, id) => {
            dispatch(actUpdateVisitorTypeRequest(visitorType, id, props.history));
        },
        onGetVisitorType: (id) => {
            dispatch(actGetVisitorTypeRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitorTypesActionCMS);
