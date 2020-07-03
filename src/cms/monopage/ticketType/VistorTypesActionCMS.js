import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddVisitorTypeRequest, actUpdateVisitorTypeRequest, actGetVisitorTypeRequest } from '../../../actions/indexVisitorTypes';
import { Form } from 'react-bootstrap'

class VistorTypesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtProductCode: '',
            txtPrice: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditVisitorType(id)
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
        var { id, txtName, txtProductCode, txtPrice } = this.state;
        var visitorType = {
            id: id,
            typeName: txtName,
            typeKey: txtProductCode,
            price: txtPrice,
            ticketTypeId: this.props.location.state.id
        };
        if (id) {
            this.props.onUpdateVisitorType(visitorType);
        } else {
            this.props.onAddVisitorType(visitorType);
        }
    }

    render() {
        var { txtName, txtPrice, txtProductCode } = this.state;
        const  data  = this.props.location.state
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>Type Name </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Product Code </label>
                        <input onChange={this.onChange} value={txtProductCode} name="txtProductCode" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Price </label>
                        <input onChange={this.onChange} value={txtPrice} name="txtPrice" type="number" className="form-control" />
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
        onUpdateVisitorType: (visitorType) => {
            dispatch(actUpdateVisitorTypeRequest(visitorType, props.history));
        },
        onGetVisitorType: (id) => {
            dispatch(actGetVisitorTypeRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VistorTypesActionCMS);
