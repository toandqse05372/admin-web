import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddCategoryRequest, actUpdateCategoryRequest, actGetCategoryRequest } from '../../../actions/indexCategories';
import { FormControl } from 'react-bootstrap'

class CategoryActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtKey: '',
            fileImage: null
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
        var value = name === 'fileImage' ? target.files[0] : target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtName, txtKey, fileImage } = this.state;
        var category = {
            id: id,
            categoryName: txtName,
            typeKey: txtKey
        };
        let data = new FormData();
        if (fileImage !== null && typeof fileImage !== "undefined") {
            data.append('file', fileImage, fileImage.name);
        }
        data.append('category', JSON.stringify(category));
        if (id) {
            this.props.onUpdateCategory(data, id);
        } else {
            this.props.onAddCategory(data);
        }
    }

    render() {
        var { txtName, txtKey } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Please enter full information</legend>
                    <div className="form-group">
                        <label>Category Name *</label>
                        <input required onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Choose image file </label>
                        <FormControl id="formControlsFile"
                            type="file"
                            label="File"
                            name="fileImage"
                            onChange={this.onChange} />
                    </div>
                    {/* <div className="form-group">
                        <label>Category Key </label>
                        <input onChange={this.onChange} value={txtKey} name="txtKey" type="text" className="form-control" />
                    </div> */}
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
        onUpdateCategory: (city, id) => {
            dispatch(actUpdateCategoryRequest(city, props.history, id));
        },
        onGetCategory: (id) => {
            dispatch(actGetCategoryRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryActionCMS);
