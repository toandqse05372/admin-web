import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddGameRequest, actUpdateGameRequest, actGetGameRequest } from '../../../actions/indexGames';
import Select from 'react-select'

class GamesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtDescription: '',
            drbGameId: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditGame(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.gameName,
                txtDescription: itemEditing.gameDescription,
                drbPlaceId: itemEditing.placeId
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
            PlaceId: drbPlaceId
        };
        if (id) {
            this.props.onUpdateGame(game);
        } else {
            this.props.onAddGame(game);
        }
        this.props.history.goBack();
    }

    render() {
        const options = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
        ]
        var { txtName, txtDescription, drbPlaceId } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Vui lòng nhập đầy đủ thông tin</legend>
                    <div className="form-group">
                        <label>Tên trò chơi </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="myDiv">
                        <label>Địa điểm </label>
                        <div >
                        <Select options={options}/>
                        </div>
                        
                    </div>

                    <div className="form-group">
                        <label>Giới thiệu </label>
                        <textarea onChange={this.onChange} value={txtDescription} name="txtDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <Link to="/games" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Trở lại
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Lưu trò chơi
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
        onAddGame: (game) => {
            dispatch(actAddGameRequest(game, props.history));
        },
        onUpdateGame: (game) => {
            dispatch(actUpdateGameRequest(game, props.history));
        },
        onEditGame: (id) => {
            dispatch(actGetGameRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesActionCMS);
