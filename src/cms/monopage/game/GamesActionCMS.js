import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddGameRequest, actUpdateGameRequest, actGetGameRequest } from '../../../actions/indexGames';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces';
import Select from 'react-select'
import { Button, Accordion, Card } from 'react-bootstrap'

// const [open, setOpen] = useState(false);

class GamesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtDescription: '',
            drbGameId: '',
            drbPlaceId: '',
            loaded: false,
            fetched: false,
        };

    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditGame(id)
        } // else => add
        this.props.fetchAllPlaces();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.gameName,
                txtDescription: itemEditing.gameDescription,
                drbPlaceId: itemEditing.placeId,
                fetched: true
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

    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtName, txtDescription, drbPlaceId } = this.state;
        var game = {
            id: id,
            gameName: txtName,
            gameDescription: txtDescription,
            placeId: drbPlaceId
        };
        if (id) {
            this.props.onUpdateGame(game);
        } else {
            this.props.onAddGame(game);
        }
    }

    onChangePlace = (e) => {
        const { drbPlaceId } = this.state;
        this.setState({
            drbPlaceId: e.value
        });
        console.log(drbPlaceId);
    }

    render() {
        var { places } = this.props;
        var { txtName, txtDescription, drbPlaceId, loaded } = this.state;
        var options = []
        var renderOpt = drbPlaceId
        if (places.length > 0 && this.state.fetched) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                options.push(option);
                if (drbPlaceId === places[i].id) {
                    renderOpt = i
                    debugger
                }
            }
            loaded = true;
        }  
        if(loaded){
            debugger
            return (
                <div className="container">
                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="form-group">
                            <label>Game Name </label>
                            <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                        </div>
                        <div className="myDiv">
                            <label>Place Name </label>
                            <div >
                                <Select
                                    openMenuOnClick={true}
                                    options={options}
                                    defaultValue={options[renderOpt]}
                                    onChange={this.onChangePlace}
                                    />
                            </div>
                        </div>
                        {/* <button
                            type="button" class="btn btn-info"
                            data-toggle="collapse" data-target={"#" + drbPlaceId}>
                            Next Step
                        </button> */}
                        {/* <div id={drbPlaceId} class={drbPlaceId?"collapse in":"collapse"}>
                            <div className="myDiv">
                                <label>{drbPlaceId} </label>
                                <div style={{position: "hidden"}} >
                                    <Select options={options}
                                        defaultValue={options[renderOpt]}
                                        onChange={this.onChangePlace} />
                                </div>
                            </div>
                        </div> */}

                            <div style={{visibility: drbPlaceId?"visible":"hidden"}} className="myDiv">
                                <label>{drbPlaceId} </label>
                                <div  >
                                    {/* thứ mà hiện ra sau khi chọn dropdown */}
                                    {/* new select chọn game */}
                                </div>
                            </div>

                        <div className="form-group">
                            <label>Description </label>
                            <textarea onChange={this.onChange} value={txtDescription} name="txtDescription" className="form-control" rows="3">
                            </textarea>
                        </div>
                        <Link to="/games" className="btn btn-danger mr-5">
                            <i className="glyphicon glyphicon-arrow-left"></i>Back
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            <i className="glyphicon glyphicon-save"></i> Save Game
                                </button>
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
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddGame: (game) => {
            dispatch(actAddGameRequest(game, props.history));
        },
        onUpdateGame: (game) => {
            dispatch(actUpdateGameRequest(game, props.history));
        },
        onEditGame: (id) => {
            dispatch(actGetGameRequest(id));
        },
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesActionCMS);
