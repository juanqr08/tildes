import React, { Component, Fragment } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { URL } from '../constants/Request';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled('input')({
  display: 'none',
});

const columns = [
  { field: 'id', headerName: 'N- Pagina', with: 100},
  { field: 'word', headerName: 'Palabra Encontrada', flex: 1 },
  { field: 'wordwithtilde', headerName: 'Palabra con Tilde', flex: 1 },
  { field: 'line', headerName: 'Linea', flex: 1, width: '100%' }
];

class VerifyTildes extends Component{

  constructor(){
      super();
      this.state = {
          selectedFile: '',
          nameFile: '',
          result: '',
          list: [],
          timeResult: 0,
          count: 0,
          pageSize: 5,
          openprogress: false,
          openAlert: false,
          openAlertError: false,
          openAlertWarning: false,
          messagesuccess: "",
          messageerror: "",
          messagewarning: "",
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.submit = this.submit.bind(this);
      this.parserResult = this.parserResult.bind(this);
      this.handleCloseAlertWarning = this.handleCloseAlertWarning.bind(this);
      this.handleCloseAlertError = this.handleCloseAlertError.bind(this);
      this.handleCloseAlert = this.handleCloseAlert.bind(this);
      this.handleCloseProgress = this.handleCloseProgress.bind(this);
  }

  handleInputChange(event) {
    this.setState({
        selectedFile: event.target.files[0],
        nameFile: event.target.files[0].name
    });
  }

  handleCloseAlertError(event, reason) {
    this.setState({openAlertError: false});
  };

  handleCloseAlertWarning(event, reason) {
    this.setState({openAlertWarning: false});
  };

  handleCloseAlert(event, reason) {
    this.setState({openAlert: false})
  };

  handleCloseProgress(event) {
    if (event.type !== "click") {
      this.setState({openprogress: false});
    }
  };

  submit(){
    if (this.state.selectedFile === undefined || this.state.selectedFile === '') {
      this.setState({messagewarning: "Se debe cargar un archivo PDF."})
      this.setState({openAlertWarning: true})
      return
    } else {
      this.setState({openprogress: true});
      const formData = new FormData() 
      formData.append('file', this.state.selectedFile)
      // console.warn(this.state.selectedFile);
      axios.post(
        `${URL}/tildes/verifyPdf/`,
        formData
      ).then( response => {
        console.log(response.data)
        this.setState({openprogress: false});
        this.setState({result: response.data, count: 0})
        this.setState({openAlert: true})
        this.setState({messagesuccess: `Archivo ${this.state.selectedFile.name} analizado correctamente.`})
      })
      .catch( error => {
        console.error(error)
        this.setState({openprogress: false});
        this.setState({openAlert: false})
        this.setState({messageerror: error.message})
        this.setState({openAlertError: true})
      })
    }
  }

  parserResult() {
    if (this.state.count < 1) {
      const result = this.state.result.result
      // console.log(result)
      let listResult = [];
      Object.keys(result).forEach( item => {
        Object.values(result[item]).forEach( ort => {
          listResult.push({
            id: item,
            word: ort['word'],
            wordwithtilde: ort['wordwithtilde'],
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
        <Typography variant="p" component="div" sx={{ flexGrow: 1 }} style={{ marginLeft: '10px', marginTop: '20px' }}>
        Tiempo de Analisis: {Math.round(this.state.result.time) < 60 ? (
          <p>{Math.round(this.state.result.time)} Segundos</p>
        ): (
          <p>{Math.round(this.state.result.time / 60)} Minutos</p>
        )}
        </Typography>
        <DataGrid
            rows={this.state.list}
            columns={columns}
            pageSize={this.state.pageSize}
            onPageSizeChange={(newPageSize) => this.setState({pageSize: newPageSize})}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            pagination
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
            checkboxSelection
        />
        <Divider />
      </Fragment>
    )
  }
  
  render() {
    return (
      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={this.state.openAlert} autoHideDuration={6000} onClose={this.handleCloseAlert}>
            <Alert onClose={this.handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            {this.state.messagesuccess}
            </Alert>
          </Snackbar>
        </Stack>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={this.state.openAlertError} autoHideDuration={6000} sx={{ width: '300px' }} onClose={this.handleCloseAlertError}>
            <Alert onClose={this.handleCloseAlertError} severity="error" sx={{ width: '100%' }}>
              <AlertTitle>Error</AlertTitle>
              {this.state.messageerror}
            </Alert>
          </Snackbar>
        </Stack>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={this.state.openAlertWarning} autoHideDuration={6000} sx={{ width: '300px' }} onClose={this.handleCloseAlertWarning}>
            <Alert onClose={this.handleCloseAlertWarning} severity="warning" sx={{ width: '100%' }}>
              <AlertTitle>Advertencia</AlertTitle>
              {this.state.messagewarning}
            </Alert>
          </Snackbar>
        </Stack>
        <Dialog fullWidth disableEscapeKeyDown open={this.state.openprogress} onClose={this.handleCloseProgress}>
          <DialogTitle>Cargando...</DialogTitle>
          <DialogContent>
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          </DialogContent>
        </Dialog>
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