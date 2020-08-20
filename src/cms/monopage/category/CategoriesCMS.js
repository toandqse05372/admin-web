import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import CategorieItem from './components/CategoryItem';
import CategorieList from './components/CategoryList';
import { actDeleteCategoryRequest } from '../../../actions/indexCategories';
import axios from 'axios';
import * as Config from '../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';

class CategoriesCMS extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
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
        this.setState({
            currentPage: 1
        })
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        this.props.showOverlay(LoadType.loading)
        axios.get(Config.API_URL + '/category/searchByName',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    categoryName: paramBody.categoryName,
                    limit: paramBody.limit,
                    page: paramBody.page
                }

            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems
            })
        }).catch(function (error) {
            this.props.showOverlay(LoadType.none)
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            if (localStorage.getItem('deleteResult')) {
                const excelResult = localStorage.getItem('deleteResult');
                if(excelResult === "OK"){
                    NotificationManager.success('Success message', 'Deltete category successful');
                    localStorage.removeItem('deleteResult');
                }else{
                    NotificationManager.error('Error message', "Something wrong");
                    localStorage.removeItem('deleteResult');
                }
            }
            const pageList = []
            const { txtCategoryName, drbLimit, currentPage, searchList, totalItems } = this.state;
            for (let i = 1; i <= this.state.totalPage; i++) {
                pageList.push(i)
            }
            const renderPageNumbers = pageList.map(number => {
                if (number == currentPage) {
                    return (
                        <li className="active" disabled >
                            <a value={number} >{number}</a>
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
                    <CategorieList limit={drbLimit} totalItems={totalItems}>
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

    handleDelete(itemId) {
        this.props.showOverlay(LoadType.deleting)
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/category/${itemId}`,{
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            this.props.showOverlay(LoadType.none)
            const items = searchList.filter(item => item.id !== itemId)
            if (items.length == 0) {
                localStorage.setItem('deleteResult', 'OK');
                window.location.reload()
            } else {
                NotificationManager.success('Success message', 'Delete category successful');
                this.setState({
                    searchList: items
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if(error.response){
                if(error.response.data === 'CATEGORY_NOT_FOUND'){
                    NotificationManager.error('Error  message', 'Category not found');
                }else{
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
        });
    }

    showCategories(categories) {
        var result = null;
        var { onDeleteCategory } = this.props;
        if (categories.length > 0) {
            result = categories.map((category, index) => {
                return <CategorieItem category={category} key={index} index={index} onDeleteCategory={this.handleDelete}
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
        },
        showOverlay: (status) => {
            dispatch(actUpdateOverlay(status))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesCMS);