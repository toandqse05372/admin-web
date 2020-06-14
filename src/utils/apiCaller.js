import axios from 'axios';
import * as Config from '../constants/ConfigURL';

export default function callApi(endpoint, method = 'GET', body) {
    return axios({
        method,
        url: `${Config.API_URL}/${endpoint}`,
        headers: {
            Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
        },
        data: body
    });
}