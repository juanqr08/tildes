import React, { Component, Fragment, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { URL } from '../constants/Request';
import Axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

const Input = styled('input')({
  display: 'none',
});

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'word', headerName: 'Palabra', flex: 1},
  { field: 'wordwithtilde', headerName: 'Palabra con Tilde', flex: 1 }
];


const Tildes = () => {
  
  const [list, setList] = useState([]);
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  
  const submit = () => {
    if (selection.length <= 20) {
      selection.forEach( id_selection => {
        Axios.delete(`${URL}/tildes/${id_selection}`, ).then( response => {
          console.log(response);
          Axios({
            url: `${URL}/tildes`
          }).then( response => {
            let count = 0;
            let result_data = []
            Object.values(response.data).forEach( item => {
              count += 1;
              result_data.push({
                id: count,
                id_word: item['id'],
                word: item['word'],
                wordwithtilde: item['wordwithtilde']
              });
            });
            setList(result_data);
          })
          .catch( error => {
            console.log(error)
          })
        })
        .catch( error => {
          console.log(error)
        })
      });
    }
  }
  
  useEffect(() => {
    Axios({
      url: `${URL}/tildes`
    }).then( response => {
      // console.log(response.data)
      let count = 0;
      let result_data = []
      Object.values(response.data).forEach( item => {
        count += 1;
        result_data.push({
          id: count,
          id_word: item['id'],
          word: item['word'],
          wordwithtilde: item['wordwithtilde']
        });
      });
      setList(result_data);
    })
    .catch( error => {
      console.log(error)
    })
  }, [setList])

  return (
    <div style={{ height: 500, width: '100%' }}>
        <label htmlFor="contained-button-file" style={{ marginLeft: '95%' }}>
          <Input id="contained-button-file" type="button" onClick={submit} />
          <IconButton variant="contained" component="span">
            <DeleteIcon />
          </IconButton>
        </label>
        <Divider />
        <Fragment>
          <DataGrid
              rows={list}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              checkboxSelection
              onSelectionModelChange={(newSelection) => {
                let listSelect = list.filter( item => newSelection.find(sel => sel == item.id))
                let resultSelect = listSelect.map( ids => ids.id_word);
                setSelection(resultSelect);
              }}
          />
        </Fragment>
    </div>
  );
}

export default Tildes;