import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddGameRequest, actUpdateGameRequest, actGetGameRequest } from '../../../actions/indexGames';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces';
import Select from 'react-select'
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
            errorPlace: ''
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

        if(drbPlaceId === ''){
            this.setState({
                errorPlace: 'Please choose a place'
            })
        }else{
            if (id) {
                this.props.onUpdateGame(game);
            } else {
                this.props.onAddGame(game);
            }
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
        var { places, match } = this.props;
        var { txtName, txtDescription, drbPlaceId, loaded, errorPlace } = this.state;
        var options = []
        var renderOpt = drbPlaceId
        if (places.length > 0 && this.state.fetched) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                options.push(option);
                if (drbPlaceId === places[i].id) {
                    renderOpt = i
                }
            }
            loaded = true;
        }
        if (loaded) {
            return (
                <div className="container">
                    <h1> {match ? 'Update game': 'Add new game'} </h1>
                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="form-group">
                            <label>Game Name *</label>
                            <input required style={{ width: 350 }} onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                        </div>
                        <div className="myDiv">
                            <label>Place Name *</label>
                            <a className="rowElement">
                                <Select
                                    required
                                    openMenuOnClick={true}
                                    options={options}
                                    defaultValue={options[renderOpt]}
                                    onChange={this.onChangePlace}
                                /> 
                            </a>
                            <span className="rowElement"><h3 style={{color: 'red'}}>{errorPlace}</h3></span>
                        </div>

                        <div className="form-group">
                            <label>Description </label>
                            <textarea style={{ width: 350 }} onChange={this.onChange} value={txtDescription} name="txtDescription" className="form-control" rows="3">
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
