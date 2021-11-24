import React, { Component, Fragment, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { URL } from '../constants/Request';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

const Input = styled('input')({
  display: 'none',
});

const columns = [
  { field: 'id', headerName: 'N- Pagina', with: 100},
  { field: 'word', headerName: 'Palabra Encontrada', flex: 1 },
  { field: 'line', headerName: 'Linea', flex: 1 }
];

class VerifyTildes extends Component{

  constructor(){
      super();
      this.state = {
          selectedFile: '',
          nameFile: '',
          result: '',
          list: [],
          count: 0,
          pageSize: 5
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.submit = this.submit.bind(this);
      this.parserResult = this.parserResult.bind(this);
  }

  handleInputChange(event) {
    this.setState({
        selectedFile: event.target.files[0],
        nameFile: event.target.files[0].name
    });
  }

  submit(){
    if (this.state.selectedFile === undefined || this.state.selectedFile === '') {
      console.log("entra")
    } else {
      const formData = new FormData() 
      formData.append('file', this.state.selectedFile)
      console.warn(this.state.selectedFile);
      axios.post(
        `${URL}/tildes/verifyPdf/`,
        formData
      ).then( response => {
        console.log(response.data)
        this.setState({result: response.data, count: 0})
      })
      .catch( error => {
        console.log(error)
      })
    }
  }

  parserResult() {
    if (this.state.count < 1) {
      const result = this.state.result.result
      console.log(result)
      let listResult = [];
      Object.keys(result).forEach( item => {
        Object.values(result[item]).forEach( ort => {
          listResult.push({
            id: item,
            word: ort['word'],
            line: ort['line']
          });
        });
      });
      this.setState({
        list: listResult
      })
      this.setState({count: 1})
    }
    return (
      <Fragment>
        <DataGrid
            rows={this.state.list}
            columns={columns}
            pageSize={this.state.pageSize}
            onPageSizeChange={(newPageSize) => this.setState({pageSize: newPageSize})}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            pagination
            checkboxSelection
        />
      </Fragment>
    )
  }
  
  render() {
    return (
      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <TextField
          style={{width: '90%', marginLeft: '20px'}}
          disabled
          id="standard-disabled"
          label="Archivo a Verificar"
          value={this.state.nameFile}
          variant="standard"
        />
        <label htmlFor="contained-button-file">
          <Input accept=".pdf" id="contained-button-file" type="file" onChange={this.handleInputChange} />
          <IconButton variant="contained" component="span">
            <PictureAsPdfIcon />
          </IconButton>
        </label>
        <label htmlFor="contained-button-send-file">
          <Input id="contained-button-send-file" type="submit" onClick={this.submit} />
          <IconButton color="primary" aria-label="upload picture" component="span">
            <SendIcon />
          </IconButton>
        </label>
        { this.state.result &&
          <this.parserResult />
        }
      </div>
    );
  }
}

export default VerifyTildes;