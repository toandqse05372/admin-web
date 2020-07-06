import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddPaymentMethodRequest, actUpdatePaymentMethodRequest, actGetPaymentMethodRequest } from '../../../actions/indexPaymentMethod';
import { Form } from 'react-bootstrap'

class CitiesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtKey: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditPaymentMethod(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.methodName,
                txtKey: itemEditing.methodKey
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
        var { id, txtKey, txtName } = this.state;
        var method = {
            id: id,
            methodKey: txtKey,
            methodName: txtName
        };
        if (id) {
            this.props.onUpdatePaymentMethod(method);
        } else {
            this.props.onAddPaymentMethod(method);
        }
    }

    render() {
        var { txtKey, txtName } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>Payment Method Key </label>
                        <input onChange={this.onChange} value={txtKey} name="txtKey" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Payment Method Name </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <Link to="/paymentMethods" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Back
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Save Payment Method
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
        onAddPaymentMethod: (method) => {
            dispatch(actAddPaymentMethodRequest(method, props.history));
        },
        onUpdatePaymentMethod: (method) => {
            dispatch(actUpdatePaymentMethodRequest(method, props.history));
        },
        onEditPaymentMethod: (id) => {
            dispatch(actGetPaymentMethodRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesActionCMS);
