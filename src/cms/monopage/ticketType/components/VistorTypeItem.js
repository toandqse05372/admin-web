import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import callApi from '../../../../utils/apiCaller';

class VistorTypeItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteCity(id);
        }
    }

    onImportExcel() {
        document.getElementById('hiddenFileInput').click();

    }

    uploadExcel = (e) => {
        let dataForm = new FormData();
        dataForm.append('file', e.target.files[0]);
        dataForm.append('codeType', this.props.vistors.typeKey);
        callApi('upload', 'POST', dataForm).then(res => {

        });
    }

    render() {
        var { vistors, index, limit, currentPage, ticketTypeId, ticketTypeName } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{vistors.typeName}</td>
                <td>{vistors.price} VNĐ</td>
                <td>{vistors.typeKey}</td>

                <td className="center">
                    {/* <FormControl id="formControlsFile"
                    className="btn btn-success mb-5"
                        type="file"
                        multiple
                        label="File"
                        name="fileImage"
                        onChange={this.onImportExcel()} /> */}
                    <button className="btn btn-success mb-5" type="file"
                        onClick={() => this.onImportExcel()}>
                        Import code from excel
                    </button>
                    <input type="file"
                        id="hiddenFileInput" style={{ display: "none" }}
                        onChange={this.uploadExcel}
                    />
                    <Link to={{
                        pathname: `/ticketTypes/vistors/${vistors.id}/edit`,
                        state: { id: ticketTypeId, name: ticketTypeName } // your data array of objects
                    }} className="btn btn-info">
                        <i className="halflings-icon white edit"></i>
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(vistors.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>

        );
    }
}



export default VistorTypeItem;
