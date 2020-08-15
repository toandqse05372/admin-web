import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import * as Config from '../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actFetchPlacesRequest } from '../../actions/indexPlaces'
import Select from 'react-select'
import callApi from '../../utils/apiCaller';
import { actUpdateOverlay } from '../../actions/indexOverlay';
import * as LoadType from '../../constants/LoadingType';
import { Form, Button } from 'react-bootstrap'
import SaleItem from './component/SaleItem';
import SaleList from './component/SaleList';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            loadedTable: false,
            searchList: [],
            txtPlaceName: '',
            drbPlaceId: 0,
            drbOption: 0,
            startDate: new Date().setHours(0,0,0,0),
            endDate: new Date().setHours(23,59,59,0),
            history: null,
            totalRevenue: 0,
        }
    }
    componentDidMount() {
        this.props.fetchAllPlaces()
    }

    onChangeOption = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        })
    }

    onChangePlace = (e) => {
        this.setState({
            drbPlaceId: e.value,
            txtPlaceName: e.label
        });
    }

    receivedData() {
        const { drbPlaceId, drbOption, startDate, endDate } = this.state
        this.props.showOverlay(LoadType.loading)
        this.setState({
            searchList: []
        })
        axios.get(Config.API_URL + '/report',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    placeId: drbPlaceId,
                    type: drbOption,
                    startDate: drbOption == 3 ? startDate : null,
                    endDate: drbOption == 3 ? endDate : null
                }
            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                searchList: res.data.reportItemList,
                history: res.data,
                totalRevenue: res.data.totalRevenue
            })
        }).catch(error => {
            console.log(error.response);
        });
    }

    changeStart(date) { this.setState({ startDate: date.getTime() }) }

    changeEnd(date) { this.setState({ endDate: date.getTime() }) }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody);
    }

    sendReport() {
        this.props.showOverlay(LoadType.sending)
        callApi('sendReport', 'POST', this.state.history).then(res => {
            if (res) {
                this.props.showOverlay(LoadType.none)
                NotificationManager.success('Success message', 'Sent report successful');
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                NotificationManager.error('Error  message', 'Something wrong');
            }
        });
    }

    render() {
        var { places } = this.props;
        var { drbPlaceId, loaded, drbOption, searchList, txtPlaceName, startDate, endDate, totalRevenue } = this.state;
        var optionsPlace = []
        if (places.length > 0 && !this.state.fetchedPlace) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                optionsPlace.push(option);
            }
            loaded = true
        }
        if (loaded) {
            return (
                <div className="container span14">
                    <h1>Sales Report</h1>
                    <Form onSubmit={this.onSubmitSearch} >
                        <div className="myDiv">
                            <h3>Place Name: {txtPlaceName} </h3>
                            <div className="rowElement">
                                <Select
                                    options={optionsPlace}
                                    onChange={this.onChangePlace}
                                />
                            </div>
                        </div>
                        <div style={{ display: drbPlaceId ? "" : "none" }}>
                            <h3>Report: </h3>
                            <Form.Control as="select"
                                style={{ width: 360 }}
                                name="drbOption"
                                value={drbOption}
                                onChange={this.onChangeOption}>
                                <option key={0} index={0} value={0}>Daily</option>
                                <option key={1} index={1} value={1}>Weekly</option>
                                <option key={2} index={2} value={2}>Monthly</option>
                                <option key={3} index={3} value={3}>Custom</option>
                            </Form.Control>
                        </div>
                        <div style={{ display: drbOption == 3 ? "" : "none" }}>
                            <div className="rowElement">
                                <h3>From date</h3>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={startDate}
                                    selectsStart
                                    onChange={date => this.changeStart(date)}
                                    startDate={startDate}
                                    endDate={endDate}
                                /></div>
                            <div className="rowElement">
                                <h3>To date</h3>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={endDate}
                                    selectsEnd
                                    onChange={date => this.changeEnd(date)}
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                /></div>
                        </div>
                        <Button
                            type="Submit"
                            className="btn btn-inverse mb-5">
                            Show report
                            </Button>

                    </Form>

                    <div style={{ display: searchList.length > 0 ? "" : "none" }}>
                        <button className="btn btn-success mb-5" type="file"
                            onClick={() => this.sendReport()}>
                            Send report
                        </button>
                        <SaleList>
                            {this.showSales(searchList)}
                            <th colspan="4">Total Revenue: {totalRevenue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} VNĐ</th>
                        </SaleList>
                    </div>
                </div>
            );
        } else
            return ""
    }

    showSales(sales) {
        var result = null;
        if (sales.length > 0) {
            result = sales.map((sale, index) => {
                return <SaleItem sale={sale} key={index} index={index} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        places: state.places
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        },
        showOverlay: (overlay) => {
            dispatch(actUpdateOverlay(overlay))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);