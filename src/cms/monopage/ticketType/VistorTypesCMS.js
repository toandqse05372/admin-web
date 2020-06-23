import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import VistorTypeItem from './components/VistorTypeItem';
import VistorTypeList from './components/VistorTypeList';
import { actDeleteCityRequest } from '../../../actions/indexCities';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';

class VistorTypesCMS extends Component {
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

            txtCityName: '',

            paramBody: {
                name: '',
                detailDescription: '',
                shortDescription: '',
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
                name: (name === "txtCityName") ? value : this.state.txtCityName,
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
        axios.get(URL.API_URL + '/city/searchByName',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    name: paramBody.name,
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
            const { txtCityName, drbLimit, currentPage } = this.state;
            var { ages } = this.props;
            return (
                <div className="container span14">
                    <h1>Distribute ticket by visitor types</h1>
                    <h2>Ticket type: Vé vào cổng công viên mặt trời</h2>
                    <Link to="/vistors/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add visitor type
                    </Link>
                    <VistorTypeList>
                        {this.showAges(this.state.searchList)}
                    </VistorTypeList>
                </div>
            );
        } else
            return ""
    }

    showAges(vistors) {
        var result = null;
        var { onDeleteCity } = this.props;
        if (vistors.length > 0) {
            result = vistors.map((vistors, index) => {
                return <VistorTypeItem vistors={vistors} key={index} index={index} onDeleteCity={onDeleteCity}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        ages: state.ages
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteCity: (id) => {
            dispatch(actDeleteCityRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VistorTypesCMS);