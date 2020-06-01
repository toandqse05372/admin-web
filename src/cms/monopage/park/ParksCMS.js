import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import ParkItem from './components/ParkItem';
import ParkList from './components/ParkList';
import { actFetchParksRequest, actDeleteParkRequest } from '../../../actions/index';

class ParksCMS extends Component {
    componentDidMount() {
        // Gọi trước khi component đc render lần đầu tiên
        this.props.fetchAllParks();
    }

    render() {

        var { parks } = this.props;

        return (
            <div className="container span14">
                <Link to="/parks/add" className="btn btn-primary mb-5">
                    <i className="glyphicon glyphicon-plus"></i> Add Park
                    </Link>
                <ParkList>
                    {this.showParks(parks)}
                </ParkList>
            </div>
        );
    }

    showParks(parks) {
        var result = null;
        var { onDeletePark } = this.props;
        if (parks.length > 0) {
            result = parks.map((parks, index) => {
                return <ParkItem parks={parks} key={index} index={index} onDeletePark={onDeletePark} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    console.log(state.parks)
    return {
        parks: state.parks
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllParks: () => {
            dispatch(actFetchParksRequest());
        },
        onDeletePark: (id) => {
            dispatch(actDeleteParkRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParksCMS);;