import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddCategoryRequest, actUpdateCategoryRequest, actGetCategoryRequest } from '../../../actions/indexCategories';
import { Form } from 'react-bootstrap'

class CategoryActionCMS extends Component {

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
            this.props.onGetCategory(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.categoryName,
                txtKey: itemEditing.typeKey,
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
        var { id, txtName, txtKey } = this.state;
        var city = {
            id: id,
            categoryName: txtName,
            typeKey: txtKey
        };
        if (id) {
            this.props.onUpdateCategory(city);
        } else {
            this.props.onAddCategory(city);
        }
    }

    render() {
        var { txtName, txtKey } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>Category Name </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Category Key </label>
                        <input onChange={this.onChange} value={txtKey} name="txtKey" type="text" className="form-control" />
                    </div>
                    <Link to="/Category" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Back
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Save Category
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
        onAddCategory: (city) => {
            dispatch(actAddCategoryRequest(city, props.history));
        },
        onUpdateCategory: (city) => {
            dispatch(actUpdateCategoryRequest(city, props.history));
        },
        onGetCategory: (id) => {
            dispatch(actGetCategoryRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryActionCMS);
