import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import CategorieItem from './components/CategoryItem';
import CategorieList from './components/CategoryList';
import { actDeleteCategoryRequest } from '../../../actions/indexCategories';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';

class CategoriesCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            activePage: 1,
            drbLimit: 10,
            searchList: [],
            totalItems: 0,
            totalPage: 1,
            currentPage: 1,

            txtCategoryName: '',

            paramBody: {
                categoryName: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.state.paramBody);
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                categoryName: (name === "txtCategoryName") ? value : this.state.txtCategoryName,
                page: this.state.activePage,
                limit: (name === "drbLimit") ? value : this.state.drbLimit,
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        axios.get(URL.API_URL + '/category/searchByName',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    categoryName: paramBody.categoryName,
                    limit: paramBody.limit,
                    page: paramBody.page
                }

            }
        ).then(res => {
            //set state
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems,
                totalPage: res.data.totalPage
            })
        }).catch(function (error) {
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            const pageList = []
            const { txtCategoryName, drbLimit, currentPage, searchList } = this.state;
            for (let i = 1; i <= this.state.totalPage; i++) {
                pageList.push(i)
            }
            const renderPageNumbers = pageList.map(number => {
                if (number == currentPage) {
                    return (
                        <li className="active" disabled >
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
                        </li>
                    );
                } else
                    return (
                        <li className='pointer'>
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
                        </li>
                    );
            });
            return (
                <div className="container span14">
                    <Form onSubmit={this.onSubmitSearch} >
                        <h1>Category Manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Category Name</Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Category Name"
                                            name="txtCategoryName"
                                            value={txtCategoryName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th>
                                        <Form.Label>Show</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / page</option>
                                            <option key={1} index={1} value={15}>15 / page</option>
                                            <option key={2} index={2} value={20}>20 / page</option>
                                        </Form.Control>
                                    </th>

                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Search
                                        </Button>
                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/categories/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add Category
                </Link>
                    <CategorieList>
                        {this.showCategories(searchList)}
                    </CategorieList>
                    <div className="dataTables_paginate paging_bootstrap pagination">
                        <ul>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
            );
        } else
            return ""
    }

    handlePageChange(number) {
        this.setState({
            activePage: number,
            paramBody: {
                name: this.state.txtCityName,
                page: number,
                limit: this.state.drbLimit,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    showCategories(categories) {
        var result = null;
        var { onDeleteCategory } = this.props;
        if (categories.length > 0) {
            result = categories.map((category, index) => {
                return <CategorieItem category={category} key={index} index={index} onDeleteCategory={onDeleteCategory}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        categories: state.categories
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteCategory: (id) => {
            dispatch(actDeleteCategoryRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesCMS);