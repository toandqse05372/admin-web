import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddTicketTypeRequest, actUpdateTicketTypeRequest, actGetTicketTypeRequest } from '../../../actions/indexTicketTypes';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces';
import { actFetchGamesRequest } from '../../../actions/indexGames';
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
            drbGameId: '',
            loaded: 0,
            fetchedPlace: false,
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
                txtName: itemEditing.typeName,
                drbPlaceId: itemEditing.placeId,
                drbGameId: itemEditing.gameId
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
        this.setState({
            drbPlaceId: e.value
        });
        this.props.fetchAllGames(e.value);
    }

    onChangeGame = (e) => {
        const { drbGameId } = this.state;
        var selectedId = []
        if (e !== null) {
            for (let i = 0; i < e.length; i++) {
                selectedId.push(e[i].value)
            }
        }
        this.setState({
            drbGameId: selectedId
        });
        console.log(drbGameId);
    }
    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtName, drbGameId, drbPlaceId } = this.state;
        var city = {
            id: id,
            typeName: txtName,
            gameId: drbGameId,
            placeId: drbPlaceId
        };
        if (id) {
            this.props.onUpdateTicketType(city);
        } else {
            this.props.onAddTicketType(city);
        }
    }

    showGame() {
        var { games } = this.props;
        var { drbGameId } = this.state;
        var optionsGame = []
        var renderOptGame = drbGameId
        if (games.length > 0) {
            for (let i = 0; i < games.length; i++) {
                var option = { value: games[i].id, label: games[i].gameName }
                optionsGame.push(option);
                if (drbGameId === games[i].id) {
                    renderOptGame = i
                }
            }
        }
        return  <Select
            isMulti
            options={optionsGame}
            defaultValue={optionsGame[renderOptGame]}
            onChange={this.onChangeGame}
        />
    }

    render() {
        var { txtName, txtShortDescription, txtDetailDescription } = this.state;
        var { places } = this.props;
        var { drbPlaceId, loaded, drbGameId } = this.state;
        var optionsPlace = []
        
        var renderOptPlace = drbPlaceId

        if (places.length > 0 && !this.state.fetchedPlace) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                optionsPlace.push(option);
                if (drbPlaceId === places[i].id) {
                    debugger
                    renderOptPlace = i
                }
            }
            loaded = loaded + 1;

        }
        if (loaded === 1) {
            return (
                <div className="container">

                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="myDiv">
                            <label>Place Name </label>
                            <div >
                                <Select
                                    options={optionsPlace}
                                    defaultValue={optionsPlace[renderOptPlace]}
                                    onChange={this.onChangePlace}
                                />
                            </div>
                        </div>
                        <div style={{ display: drbPlaceId ? "" : "none" }} className="myDiv">
                            <div  >
                                {/* thứ mà hiện ra sau khi chọn dropdown */}
                                <div className="myDiv">
                                    <label>Game Name </label>
                                    <div >
                                        {this.showGame()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: drbGameId ? "" : "none" }}>
                            <div className="form-group">
                                <label>Ticket Name </label>
                                <input style={{ width: 350 }} onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Effective Time</label>
                                <textarea style={{ width: 350 }} onChange={this.onChange} value={txtShortDescription} name="txtShortDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea style={{ width: 350 }} onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Cancel Policy</label>
                                <textarea style={{ width: 350 }} onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Reservation Infomation</label>
                                <textarea style={{ width: 350 }} onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                                </textarea>
                            </div>
                            <div className="form-group">
                                <label>Conversion Method</label>
                                <textarea
                                style={{ width: 350 }}
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
        fetchAllGames: (placeId) => {
            dispatch(actFetchGamesRequest(placeId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypesActionCMS);
