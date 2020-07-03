import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddPlaceRequest, actUpdatePlaceRequest, actGetPlaceRequest } from '../../../actions/indexPlaces';
import { actFetchCategoriesRequest } from '../../../actions/indexCategories';
import { actFetchCitiesRequest } from '../../../actions/indexCities';
import { Form, FormControl } from 'react-bootstrap'
import Select from 'react-select'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PlaceMultiLangItem from './components/PlaceMultiLangItem'

const weekDays = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 7, label: 'Sun' }]

class PlacesActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',

            txtAddress: '',
            txtMail: '',
            txtPhoneNumber: '',
            fileImage: [],
            drbCityId: '',
            drbCategory: [],
            txtDescription: '',
            txtOpenHours: '',
            txtStatus: '',
            loaded: 0,
            fetched: false,
            fileImage: [],
            txtImageLink: [],

            vn: {
                txtName: '',
                txtShortDescription: '',
                txtDetailDescription: '',
            },

            en: {
                txtName: '',
                txtShortDescription: '',
                txtDetailDescription: '',
            },

            jp: {
                txtName: '',
                txtShortDescription: '',
                txtDetailDescription: '',
            },
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
            var { itemEditing } = nextProps;
            if (typeof itemEditing.id !== "undefined") {
                this.setState({
                    id: itemEditing.id,
                    vn: {
                        txtName: itemEditing.placeTrans[2].name,
                        txtShortDescription: itemEditing.placeTrans[2].shortDescription,
                        txtDetailDescription: itemEditing.placeTrans[2].detailDescription,
                    },
        
                    en: {
                        txtName: itemEditing.placeTrans[1].name,
                        txtShortDescription: itemEditing.placeTrans[1].shortDescription,
                        txtDetailDescription: itemEditing.placeTrans[1].detailDescription,
                    },
        
                    jp: {
                        txtName: itemEditing.placeTrans[0].name,
                        txtShortDescription: itemEditing.placeTrans[0].shortDescription,
                        txtDetailDescription: itemEditing.placeTrans[0].detailDescription,
                    },
                    txtMail: itemEditing.mail,
                    txtPhoneNumber: itemEditing.phoneNumber,
                    fileImage: itemEditing.placeImageLink,
                    drbCityId: itemEditing.cityId,
                    drbCategory: itemEditing.categoryId,
                    txtStatus: itemEditing.status,
                    txtPhoneNumber: itemEditing.phoneNumber,
                    txtOpenHours: itemEditing.openHours,
                    txtAddress: itemEditing.address,
                    txtImageLink: itemEditing.placeImageLink,
                    fetched: true
                })
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
                // let data = new FormData();
                // console.log(target.files[0])
                // data.append('file', target.files[i], target.files[i],name);
                // fileList.push(data)
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
        var { id, fileImage, txtAddress, txtMail, drbCityId, txtPhoneNumber, drbCategory, vn, en, jp } = this.state;
        var place = {
            id: id,
            placeTrans:[
                {
                    name: vn.txtName,
                    shortDescription: vn.txtShortDescription,
                    detailDescription: vn.txtDetailDescription,
                    langId: 1
                },
                {
                    name: en.txtName,
                    shortDescription: en.txtShortDescription,
                    detailDescription: en.txtDetailDescription,
                    langId: 2
                },
                {
                    name: jp.txtName,
                    shortDescription: jp.txtShortDescription,
                    detailDescription: jp.txtDetailDescription,
                    langId: 3
                },
            ],
            address: txtAddress,
            mail: txtMail,
            cityId: drbCityId,
            phoneNumber: txtPhoneNumber,
            categoryId: drbCategory,
        };
        let data = new FormData();
        if (fileImage !== null && typeof fileImage !== "undefined") {
            debugger
            for (let i = 0; i < fileImage.length; i++) {
                data.append('file', fileImage[i], fileImage[i].name);
                
            }
        }
        data.append('place', JSON.stringify(place));
        debugger
        if (id) {
            this.props.onUpdatePlace(data, id);

        } else {
            this.props.onAddPlace(data);
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

    onChangeChild(field, value, lang) {
        // parent class change handler is always called with field name and value
        this.setState(
            {
                [lang]: {
                    ...this.state[lang],
                    [field]: value
                }
            }
        );
    }

    render() {
        var { drbCityId, txtAddress, txtPhoneNumber, txtMail, drbCategory, loaded } = this.state;
        var { cities, categories } = this.props
        var options = []
        var renderOpt = []
        if (categories.length > 0 && this.state.fetched && typeof drbCategory !== "undefined") {
            
            for (let i = 0; i < categories.length; i++) {
                var option = { value: categories[i].id, label: categories[i].categoryName }
                options.push(option);
                if (drbCategory.includes(option.value)) {
                    renderOpt.push(option)
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
                            <label>Category </label>
                            <div >
                                <Select
                                    defaultValue={renderOpt}
                                    isMulti
                                    options={options}
                                    onChange={this.onChangeCategory}
                                />
                            </div>

                        </div>
                        <div className="form-group">
                            <label>City </label>
                            <Form.Control as="select"
                                style={{ width: 360 }}
                                name="drbCityId"
                                value={drbCityId}
                                onChange={this.onChange}>
                                <option key={0} index={0} value={0}>-- Choose City --</option>
                                {this.showCities(cities)}
                            </Form.Control>
                        </div>

                        {/* <div className="form-group">
                            <label>Open hours </label>
                            <TimePicker/>
                        </div> */}
                        <div className="form-group">
                            <label>Address </label>
                            <input style={{ width: 350 }} onChange={this.onChange} value={txtAddress} name="txtAddress" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number </label>
                            <input style={{ width: 350 }} onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="number" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Mail </label>
                            <input style={{ width: 350 }} onChange={this.onChange} value={txtMail} name="txtMail" type="text" className="form-control" />
                        </div>
                        <div className="myDiv">
                            <label>Open days </label>
                            <div >
                                <Select
                                    defaultValue={renderOpt}
                                    isMulti
                                    options={weekDays}
                                />
                            </div>

                        </div>

                        <Tabs defaultIndex={0}>
                            <TabList>
                                <Tab>Vietnamese</Tab>
                                <Tab>English</Tab>
                                <Tab>Japanese</Tab>
                            </TabList>
                            <TabPanel>
                                <PlaceMultiLangItem onChangeChild={this.onChangeChild.bind(this)} language="vn" {...this.state.vn}/>
                            </TabPanel>
                            <TabPanel>
                                <PlaceMultiLangItem onChangeChild={this.onChangeChild.bind(this)} language="en" {...this.state.en}/>
                            </TabPanel>
                            <TabPanel>
                                <PlaceMultiLangItem onChangeChild={this.onChangeChild.bind(this)} language="jp" {...this.state.jp}/>
                              
                            </TabPanel>
                        </Tabs>


                        <div className="form-group">
                            <label>Choose image file </label>
                            <FormControl id="formControlsFile"
                                type="file"
                                multiple
                                label="File"
                                name="fileImage"
                                onChange={this.onChange} />
                        </div>
                        <br />
                        <Link to="/Places" className="btn btn-danger mr-5">
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

    showCategories(categories) {
        var result = null;
        if (categories.length > 0) {
            result = categories.map((categories, index) => {
                return <option key={index} index={index} value={categories.id}>{categories.categoryName}</option>
            });
        }
        return result;
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
