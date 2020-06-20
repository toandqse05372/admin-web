import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddTicketTypeRequest, actUpdateTicketTypeRequest, actGetTicketTypeRequest } from '../../../actions/indexTicketTypes';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces';
import { Form } from 'react-bootstrap'

class TicketTypesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtShortDescription: '',
            txtDetailDescription: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditTicketType(id)
        } // else => add
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
                        <textarea onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                        </textarea>
                    </div>
                    <Link to="/ticketTypes" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Back
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Save Ticket Type
                            </button>
                </form>
            </div>
        );
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
        onAddTicketType: (city) => {
            dispatch(actAddTicketTypeRequest(city, props.history));
        },
        onUpdateTicketType: (city) => {
            dispatch(actUpdateTicketTypeRequest(city, props.history));
        },
        onGetTicketType: (id) => {
            dispatch(actGetTicketTypeRequest(id));
        },
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypesActionCMS);
