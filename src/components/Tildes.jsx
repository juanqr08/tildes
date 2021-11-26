import React, { Fragment, useEffect, useState } from 'react';
import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import { URL } from '../constants/Request';
import Axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled('input')({
  display: 'none',
});

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'word', headerName: 'Palabra', flex: 1, editable: true},
  { field: 'wordwithtilde', headerName: 'Palabra con Tilde', flex: 1, editable: true }
];


const Tildes = () => {
  
  const [list, setList] = useState([]);
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [openprogress, setOpenprogress] = React.useState(false);
  const [word, setWord] = React.useState("");
  const [wordwithtilde, setWordwithtilde] = React.useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertWarning, setOpenAlertWarning] = React.useState(false);
  const [openAlertError, setOpenAlertError] = React.useState(false);
  const [messageerror, setMessageerror] = React.useState("");
  const [messagewarning, setMessagewarning] = React.useState("");

  const handleCloseAlertError = (event, reason) => {
    setOpenAlertError(false);
  };
  
  const handleCloseAlertWarning = (event, reason) => {
    setOpenAlertWarning(false);
  };

  const handleCloseAlert = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }

    setOpenAlert(false);
  };

  const addWord = () => {
    setOpen(true);
  }

  const addWordSubmit = () => {
    // console.log(word)
    // console.log(wordwithtilde)
    if (!word || !wordwithtilde) {
      setMessagewarning("Ninguno de los campos pueden estar vacios.")
      setOpenAlertWarning(true)
      return
    }
    let dataPost = {
      "word": word,
      'wordwithtilde': wordwithtilde
    }
    Axios.post(`${URL}/tildes/`, dataPost).then( response => {
      // console.log(response);
      setOpen(false);
      setOpenprogress(true);
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
        setOpenAlert(true)
      })
      .catch( error => {
        console.error(error)
        setOpenAlert(false)
        setMessageerror(error.message)
        setOpenAlertError(true)
      })
    })
    .catch( error => {
      console.error(error)
      setOpenAlert(false)
      setMessageerror(error.message)
      setOpenAlertError(true)
    })
  }

  const handleCloseProgress = (event) => {
    if (event.type !== "click") {
      setOpenprogress(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    if (selection.length <= 20) {
      selection.forEach( id_selection => {
        Axios.delete(`${URL}/tildes/${id_selection}`).then( response => {
          // console.log(response);
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
            console.error(error)
          })
        })
        .catch( error => {
          console.error(error)
        })
      });
    }
  }
  
  useEffect(() => {
    setOpenprogress(true);
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
      setOpenprogress(false);
    })
    .catch( error => {
      console.error(error.message)
      setOpenprogress(false);
      setMessageerror(error.message)
      setOpenAlertError(true)
    })
  }, [setList, setOpenprogress, setMessageerror]);

  const editWord = (dataWord) => {
    try {
      if (!dataWord.value) {
        setMessagewarning("Ninguno de los campos pueden estar vacios.")
        setOpenAlertWarning(true)
        return
      }
      dataWord.row[dataWord.field] = dataWord.value
      Axios.put(`${URL}/tildes/${dataWord.row.id_word}`, dataWord.row).then( response => {
        // console.log(response);
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
          setOpenAlert(true)
        })
        .catch( error => {
          console.error(error)
          setOpenAlert(false)
          setMessageerror(error.message)
          setOpenAlertError(true)
        })
      })
      .catch( error => {
        console.log(error)
      })
    } catch (error) {
      console.error(error)      
    }
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
        <label htmlFor="contained-button-add">
          <Input id="contained-button-add" type="button" onClick={addWord} />
          <IconButton variant="contained" component="span">
            <AddIcon />
          </IconButton>
        </label>
        <label htmlFor="contained-button-file">
          <Input id="contained-button-file" type="button" onClick={submit} />
          <IconButton variant="contained" component="span">
            <DeleteIcon />
          </IconButton>
        </label>
      </div>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            Palabra Agregada.
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openAlertError} autoHideDuration={6000} sx={{ width: '300px' }} onClose={handleCloseAlertError}>
          <Alert onClose={handleCloseAlertError} severity="error" sx={{ width: '100%' }}>
            <AlertTitle>Error</AlertTitle>
            {messageerror}
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openAlertWarning} autoHideDuration={6000} sx={{ width: '300px' }} onClose={handleCloseAlertWarning}>
          <Alert onClose={handleCloseAlertWarning} severity="warning" sx={{ width: '100%' }}>
            <AlertTitle>Advertencia</AlertTitle>
            {messagewarning}
          </Alert>
        </Snackbar>
      </Stack>
      <Dialog fullWidth disableEscapeKeyDown open={openprogress} onClose={handleCloseProgress}>
        <DialogTitle>Cargando...</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Añadir Nuevas Palabras</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Formulario para añadir nuevas palabras en la Base de Datos.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="word"
            label="Palabra sin Tilde"
            type="text"
            fullWidth
            variant="standard"
            onChange={(word) => {
              setWord(word.target.value)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="wordwithtilde"
            label="Palabra con Tilde"
            type="text"
            fullWidth
            variant="standard"
            onChange={(word) => {
              setWordwithtilde(word.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addWordSubmit}>Subscribe</Button>
        </DialogActions>
      </Dialog>
        <Divider />
        <Fragment>
          <DataGrid
              rows={list}
              columns={columns}
              pageSize={pageSize}
              localeText={{
                toolbarDensity: 'Size',
                toolbarDensityLabel: 'Size',
                toolbarDensityCompact: 'Small',
                toolbarDensityStandard: 'Medium',
                toolbarDensityComfortable: 'Large',
              }}
              components={{
                Toolbar: GridToolbar,
              }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              checkboxSelection
              onSelectionModelChange={(newSelection) => {
                let listSelect = list.filter( item => newSelection.find(sel => sel == item.id))
                let resultSelect = listSelect.map( ids => ids.id_word);
                setSelection(resultSelect);
              }}
              onCellEditCommit={editWord}
          />
        </Fragment>
    </div>
  );
}

export default Tildes;