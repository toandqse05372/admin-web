import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddPlaceRequest, actUpdatePlaceRequest, actGetPlaceRequest } from '../../../actions/indexPlaces';
import { actFetchCategoriesRequest } from '../../../actions/indexCategories';
import { actFetchCitiesRequest } from '../../../actions/indexCities';
import { Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import validateInput from '../../../utils/regex';

const weekDays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }]

class PlacesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',

            txtAddress: '',
            txtMail: '',
            txtPhoneNumber: '',
            fileImage: [],
            drbCityId: 0,
            drbCategory: [],
            drbWeekDays: [],
            txtDescription: '',
            txtOpenHours: '',
            txtStatus: '',
            loaded: 0,
            fetched: false,
            fileImage: [],
            txtImageLink: [],
            txtName: '',
            txtShortDescription: '',
            txtDetailDescription: '',
            txtKey: '',

            errorCategory: '',
            erorOpenDays: '',
            errorCity: '',
            errorMail: '',
            errorPhoneNumber: '',
            errorFile: ''

        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllCities();
        this.props.fetchAlCategories();
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditPlace(id)
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
                        txtName: itemEditing.name,
                        txtShortDescription: itemEditing.shortDescription,
                        txtDetailDescription: itemEditing.detailDescription,
                        txtMail: itemEditing.mail,
                        txtPhoneNumber: itemEditing.phoneNumber,
                        drbCityId: itemEditing.cityId,
                        drbCategory: itemEditing.categoryId,
                        drbWeekDays: itemEditing.weekDays,
                        txtStatus: itemEditing.status,
                        txtPhoneNumber: itemEditing.phoneNumber,
                        txtOpenHours: itemEditing.openingHours,
                        txtAddress: itemEditing.address,
                        txtImageLink: itemEditing.placeImageLink,
                        txtKey: itemEditing.placeKey,
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
        var fileList = []
        if (name === 'fileImage') {
            for (let i = 0; i < target.files.length; i++) {
                fileList.push(target.files[i])
            }
        }
        var value = name === 'fileImage' ? fileList : target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        var { id, fileImage, txtOpenHours, drbWeekDays, txtAddress, txtMail, drbCityId, txtPhoneNumber, drbCategory, txtName,
            txtShortDescription, txtDetailDescription, txtKey } = this.state;

        var hasError = false
        var catErrorStr = ''
        if (drbCategory.length < 1) {
            catErrorStr = "Please choose at least one category"
            hasError = true
        }
        var wdErrorStr = ''
        if (drbWeekDays.length < 1) {
            wdErrorStr = "Please choose at least one open day"
            hasError = true
        }
        var cityErrorStr = ''
        if (drbCityId < 1) {
            cityErrorStr = "Please choose a city"
            hasError = true
        }
        var errorPhoneNUmberStr = ''
        if (txtPhoneNumber !== "") {
            const checkPhoneNumber = validateInput("phoneNumber", txtPhoneNumber);
            if (!checkPhoneNumber.isInputValid) {
                hasError = true
                errorPhoneNUmberStr = checkPhoneNumber.errorMessage
            }
        }
        var errorMailStr = ''
        if (txtMail !== "") {
            const checkEmail = validateInput("email", txtMail);
            if (!checkEmail.isInputValid) {
                hasError = true
                errorMailStr = checkEmail.errorMessage
            }
        }
        var errorFileStr = ''
        if (fileImage.length !== 5 && fileImage.length > 0) {
            hasError = true
            errorFileStr = "Please choose 5 files"
        }
        if (!hasError) {
            var place = {
                id: id,
                name: txtName,
                shortDescription: txtShortDescription,
                detailDescription: txtDetailDescription,
                address: txtAddress,
                mail: txtMail,
                cityId: drbCityId,
                phoneNumber: txtPhoneNumber,
                categoryId: drbCategory,
                weekDays: drbWeekDays,
                openingHours: txtOpenHours,
                placeKey: txtKey
            };
            let data = new FormData();
            if (fileImage !== null && typeof fileImage !== "undefined") {
                for (let i = 0; i < fileImage.length; i++) {
                    data.append('file', fileImage[i]);

                }
            }
            data.append('place', JSON.stringify(place));
            if (id) {
                this.props.onUpdatePlace(data, id);

            } else {
                this.props.onAddPlace(data);
            }
        } else {
            this.setState({
                errorCity: cityErrorStr,
                errorCategory: catErrorStr,
                erorOpenDays: wdErrorStr,
                errorPhoneNumber: errorPhoneNUmberStr,
                errorMail: errorMailStr,
                errorFile: errorFileStr
            })
            window.scrollTo(0, 0);
        }
    }

    onChangeCategory = (selectedOption) => {
        var selectedKey = []
        if (selectedOption !== null) {
            for (let i = 0; i < selectedOption.length; i++) {
                selectedKey.push(selectedOption[i].value)
            }
        }
        this.setState({
            drbCategory: selectedKey
        })
    }

    onChangeWeekdays = (selectedOption) => {
        var selectedKey = []
        if (selectedOption !== null) {
            for (let i = 0; i < selectedOption.length; i++) {
                selectedKey.push(selectedOption[i].value)
            }
        }
        this.setState({
            drbWeekDays: selectedKey
        })
    }

    render() {
        var { drbCityId, drbWeekDays, txtAddress, txtOpenHours, txtPhoneNumber, txtMail, drbCategory, loaded, errorMail, errorPhoneNumber,
            txtName, txtDetailDescription, txtShortDescription, erorOpenDays, errorCategory, errorCity, txtKey, errorFile } = this.state;
        var { cities, categories, match } = this.props
        var renderOptWd = []
        if (this.state.fetched) {
            if (match && typeof drbWeekDays !== "undefined") {
                if (drbWeekDays.length > 0) {
                    for (let i = 0; i < weekDays.length; i++) {
                        if (drbWeekDays.includes(weekDays[i].value)) {
                            renderOptWd.push(weekDays[i])
                            loaded = true;
                        }
                    }
                }
            } else {
                loaded = true;
            }
        }
        if (loaded) {
            return (
                <div className="container">
                    <h1> {match ? 'Update place' : 'Add new place'} </h1>
                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="form-group rowElement">
                            <label>Place Name *</label>
                            <input required style={{ width: 350 }} onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                        </div>
                        <div className="form-group rowElement">
                            <label>Place Key </label>
                            <input style={{ width: 50 }} type="text" className="form-control" value={txtKey} name="txtKey" onChange={this.onChange} />
                        </div>
                        <div className="myDiv">
                            <label>Category *</label>
                            <div className="rowElement">
                                {this.showCategories(categories, drbCategory)}
                            </div>
                            <span className="rowElement"><h3 style={{ color: 'red' }}>{errorCategory}</h3></span>
                        </div>
                        <div className="form-group">
                            <label>City *</label>
                            <div className="rowElement">
                                <Form.Control as="select"

                                    style={{ width: 360 }}
                                    name="drbCityId"
                                    value={drbCityId}
                                    onChange={this.onChange}>
                                    <option key={0} index={0} value={0}>-- Choose City --</option>
                                    {this.showCities(cities)}
                                </Form.Control>
                            </div>
                            <span className="rowElement"><h3 style={{ color: 'red' }}>{errorCity}</h3></span>
                        </div>
                        <div className="form-group">
                            <label>Address </label>
                            <input style={{ width: 350 }} onChange={this.onChange} value={txtAddress} name="txtAddress" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <div className="rowElement">
                                <label>Phone Number </label>
                                <input style={{ width: 350 }} onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="text" className="form-control" />
                            </div>
                            <span className="rowElement"><h4 style={{ color: 'red' }}>{errorPhoneNumber}</h4></span>
                        </div>
                        <div className="form-group">
                            <div className="rowElement">
                                <label>Mail</label>
                                <input style={{ width: 350 }} onChange={this.onChange} value={txtMail} name="txtMail" type="text" className="form-control" />
                            </div>
                            <span className="rowElement"><h4 style={{ color: 'red' }}>{errorMail}</h4></span>
                        </div>
                        <div className="myDiv">
                            <label>Open days *</label>
                            <div className="rowElement">
                                <Select
                                    defaultValue={renderOptWd}
                                    isMulti
                                    options={weekDays}
                                    onChange={this.onChangeWeekdays}
                                />
                            </div>
                            <span className="rowElement"><h3 style={{ color: 'red' }}>{erorOpenDays}</h3></span>
                        </div>
                        <div className="form-group">
                            <label>Opening Hours </label>
                            <textarea style={{ width: 350, height: 60 }} onChange={this.onChange} value={txtOpenHours} name="txtOpenHours" className="form-control" rows="3">
                            </textarea>
                        </div>
                        <div className="form-group">
                            <label>Short Description </label>
                            <textarea style={{ width: 350, height: 120 }} onChange={this.onChange} value={txtShortDescription} name="txtShortDescription" className="form-control" rows="3">
                            </textarea>
                        </div>
                        <div className="form-group">
                            <label>Detail Description </label>
                            <textarea style={{ width: 350, height: 120 }} onChange={this.onChange} value={txtDetailDescription} name="txtDetailDescription" className="form-control" rows="3">
                            </textarea>
                        </div>

                        <div className="form-group">
                            <div className="rowElement">
                                <label>Choose image file</label>
                                <FormControl id="formControlsFile"
                                    type="file"
                                    multiple
                                    label="File"
                                    name="fileImage"
                                    onChange={this.onChange} />
                            </div>
                            <span className="rowElement"><h4 style={{ color: 'red' }}>{errorFile}</h4></span>
                        </div>
                        <br />
                        <Link to="/places" className="btn btn-danger mr-5">
                            <i className="glyphicon glyphicon-arrow-left"></i> Back
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            <i className="glyphicon glyphicon-save"></i> Save Place
                                </button>
                    </form>
                </div>
            );
        } else {
            return ""
        }
    }

    showCities(cities) {
        var result = null;
        if (cities.length > 0) {
            result = cities.map((cities, index) => {
                return <option key={index} index={index} value={cities.id}>{cities.name}</option>
            });
        }
        return result;
    }

    showCategories(categories, choosed) {
        var options = []
        var renderOpt = []
        if (categories.length > 0 && this.state.fetched && typeof choosed !== "undefined") {
            for (let i = 0; i < categories.length; i++) {
                var option = { value: categories[i].id, label: categories[i].categoryName }
                options.push(option);
                if (choosed.includes(option.value)) {
                    renderOpt.push(option)
                }
            }
            return <Select
                defaultValue={renderOpt}
                isMulti
                options={options}
                onChange={this.onChangeCategory} />
        }
    }
}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing,
        cities: state.cities,
        categories: state.categories,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddPlace: (place) => {
            dispatch(actAddPlaceRequest(place, props.history));
        },
        onUpdatePlace: (place, id) => {
            dispatch(actUpdatePlaceRequest(place, props.history, id));
        },
        onEditPlace: (id) => {
            dispatch(actGetPlaceRequest(id));
        },
        fetchAllCities: () => {
            dispatch(actFetchCitiesRequest());
        },
        fetchAlCategories: () => {
            dispatch(actFetchCategoriesRequest());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesActionCMS);
