import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class PlaceMultiLangItem extends Component {
    constructor(props) {
        super(props);
        this.state = { }

    }

    onFieldChange(event) {
        // for a regular input field, read field name and value from the event
        const lang = this.props.language;
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.props.onChangeChild(fieldName, fieldValue, lang);
    }



    render() {
        var { txtName, txtDetailDescription, txtShortDescription } = this.props;
        return (
            <div>
                <div className="form-group">
                    <label>Place Name </label>
                    <input style={{ width: 350 }} onChange={this.onFieldChange.bind(this)} value={txtName} name="txtName" type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Short Description </label>
                    <textarea style={{ width: 350, height: 120 }} onChange={this.onFieldChange.bind(this)} value={txtShortDescription} name="txtShortDescription" className="form-control" rows="3">
                    </textarea>
                </div>
                <div className="form-group">
                    <label>Detail Description </label>
                    <textarea style={{ width: 350, height: 120 }} onChange={this.onFieldChange.bind(this)} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                    </textarea>
                </div>
            </div>

        );
    }
}

export default PlaceMultiLangItem;
