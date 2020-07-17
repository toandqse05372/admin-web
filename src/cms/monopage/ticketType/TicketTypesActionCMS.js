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
            drbGameId: [],
            loaded: false,
            fetched: false,
            gameErrorStr: '',
            gameList: [],
        };
    }

    componentWillMount() {
        var { match } = this.props;
        this.props.fetchAllPlaces();
        if (match) { // update
            var id = match.params.id;
            this.props.onEditTicketType(id)
            this.props.fetchAllGames(match.params.place)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { match } = this.props;
            var { itemEditing } = nextProps;
            if (typeof itemEditing.id !== "undefined") {
                if (itemEditing.id === Number(match.params.id)) {
                    this.setState({
                        id: itemEditing.id,
                        txtName: itemEditing.typeName,
                        drbPlaceId: itemEditing.placeId,
                        drbGameId: itemEditing.gameId,
                        fetched: true
                    })
                }
            }

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
        if (drbGameId.length < 1) {
            this.setState({
                gameErrorStr: "Please choose at least one game"
            })

        } else {
            if (id) {
                this.props.onUpdateTicketType(city);
            } else {
                this.props.onAddTicketType(city);
            }
        }
    }

    showGame(games, choosed) {
        var options = []
        var renderOpt = []
        if (games.length > 0 && this.state.fetched && typeof choosed !== "undefined") {
            for (let i = 0; i < games.length; i++) {
                var option = { value: games[i].id, label: games[i].gameName }
                options.push(option);
                if (choosed.includes(games[i].id)) {
                    renderOpt.push(option)
                }
            }
            return <Select
            defaultValue={renderOpt}
            isMulti
            options={options}
            onChange={this.onChangeGame}/>
        }
    }

    showPlace(places, choosed) {
        var options = []
        var renderOpt = null
        if (places.length > 0 && this.state.fetched && typeof choosed !== "undefined") {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                options.push(option);
                if (choosed === places[i].id) {
                    renderOpt = option
                }
            }
            return <Select
            defaultValue={renderOpt}
            options={options}
            onChange={this.onChangePlace}/>
        }
    }

    render() {
        var { txtName, txtShortDescription, txtDetailDescription, gameErrorStr,drbPlaceId, drbGameId, loaded, fetched } = this.state;
        var { places, games, match } = this.props;
        if(match){
            if(places.length > 0 && games.length > 0 && fetched){
                loaded = true
            }
        }else{
            loaded = true
        }
        if (loaded) {
            return (
                <div className="container">
                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="myDiv">
                            <label>Place Name *</label>
                            <div className="rowElement">
                                {this.showPlace(places, drbPlaceId)}
                            </div>
                        </div>
                        <div style={{ display: drbPlaceId ? "" : "none" }} className="myDiv">
                            <div className="myDiv">
                                <label>Game Name *</label>
                                <div className="rowElement">
                                    {this.showGame(games, drbGameId)}
                                </div>
                                <span className="rowElement"><h4 style={{ color: 'red' }}>{gameErrorStr}</h4></span>
                            </div>
                        </div>
                        <div style={{ display: drbGameId ? "" : "none" }}>
                            <div className="form-group">
                                <label>Ticket Name *</label>
                                <input required style={{ width: 350 }} onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
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
