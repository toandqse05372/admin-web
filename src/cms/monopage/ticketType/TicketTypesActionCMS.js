import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddTicketTypeRequest, actUpdateTicketTypeRequest, actGetTicketTypeRequest } from '../../../actions/indexTicketTypes';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces';
import { actFetchGamesRequest } from '../../../actions/indexGames';
import { Form } from 'react-bootstrap';
import Select from 'react-select'

class TicketTypesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtShortDescription: '',
            txtDetailDescription: '',
            drbPlaceId: '',
            loaded: false,
            fetchedPlace: false,
            fetchedPlace: false,
            customCheck: '',
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditTicketType(id)
        } // else => add
        this.props.fetchAllPlaces();
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
        } else {
            this.setState({
                fetched: true
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
    onChangePlace = (e) => {
        const { drbPlaceId } = this.state;
        this.setState({
            drbPlaceId: e.value
        });
        this.props.fetchAllGames();
    }

    onChangePlace2 = (e) => {
        const { customCheck } = this.state;
        this.setState({
            customCheck: e.value
        });
        console.log(customCheck);
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
            this.props.onUpdateTicketType(city);
        } else {
            this.props.onAddTicketType(city);
        }
    }

    render() {
        var { txtName, txtShortDescription, txtDetailDescription } = this.state;
        var { places, games } = this.props;
        var { drbPlaceId, customCheck, loaded } = this.state;
        var options = []
        var renderOpt = drbPlaceId
        if (places.length > 0 && !this.state.fetchedPlace) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                options.push(option);
                if (drbPlaceId === places[i].id) {
                    renderOpt = i
                }
            }
            loaded = true;
            if (games.length > 0 && this.state.fetchedPlace) {
                for (let i = 0; i < places.length; i++) {
                    var option = { value: places[i].id, label: places[i].name }
                    options.push(option);
                    if (drbPlaceId === places[i].id) {
                        renderOpt = i
                    }
                }
                loaded = true;
            }
        }
        if (loaded) {
            return (
                <div className="container">

                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>

                        {/* <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[colourOptions[4], colourOptions[5]]}
                        isMulti
                        options={colourOptions}
                    /> */}
                        <div className="myDiv">
                            <label>Place Name </label>
                            <div >
                                <Select
                                    options={options}
                                    defaultValue={options[renderOpt]}
                                    onChange={this.onChangePlace}
                                />
                            </div>
                        </div>
                        <div style={{ display: drbPlaceId ? "" : "none" }} className="myDiv">
                            <label>id u pick: {drbPlaceId} </label>
                            <div  >
                                {/* thứ mà hiện ra sau khi chọn dropdown */}
                                <div className="myDiv">
                                    <label>Place Name </label>
                                    <div >
                                        <Select
                                            options={options}
                                            defaultValue={options[renderOpt]}
                                            onChange={this.onChangePlace2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: customCheck ? "" : "none" }}>
                            <label>id u pick: {customCheck} </label>
                            <div className="form-group">
                                <label>Ticket Name </label>
                                <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Effective Time</label>
                                <textarea onChange={this.onChange} value={txtShortDescription} name="txtShortDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Cancel Policy</label>
                                <textarea onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Reservation Infomation</label>
                                <textarea onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Conversion Method</label>
                                <textarea
                                    value={txtDetailDescription}
                                    name="txtDetailDescription"
                                    className="form-control"
                                    rows="3"
                                    onBlur={this.handleBlur}
                                >
                                </textarea>
                            </div>
                        
                            <Link to="/ticketTypes" className="btn btn-danger mr-5">
                                <i className="glyphicon glyphicon-arrow-left"></i> Back
                            </Link>
                            <button type="submit" className="btn btn-primary">
                                <i className="glyphicon glyphicon-save"></i> Save Ticket Type
                            </button>
                            </div>
                    </form>
                </div>
            );
        } else {
            return ""
        }
    }

}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing,
        places: state.places,
        games: state.games
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddTicketType: (city) => {
            dispatch(actAddTicketTypeRequest(city, props.history));
        },
        onUpdateTicketType: (city) => {
            dispatch(actUpdateTicketTypeRequest(city, props.history));
        },
        onEditTicketType: (id) => {
            dispatch(actGetTicketTypeRequest(id));
        },
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        },
        fetchAllGames: () => {
            dispatch(actFetchGamesRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypesActionCMS);
