import React, {Fragment, useState} from 'react';
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import zipcelx from 'zipcelx';


const createXls = (data) => {
  const config = {
    filename: 'test',
    sheet: {
      data
    }
  };

  zipcelx(config);
}

const FormSettings = () => {

  const [state, setState] = useState({getLength: false, lengthArray: '', skipLines: 12, fileLoaded: false, lengthString:'', lineArray:[], separator: ":"});

  const handleCheckbox = name => event => {
    setState({
      ...state,
      [name]: event.target.checked
    });
  };
  const handleChange = name => event => {
    setState({
      ...state,
      [name]: event.target.value
    });
  };
  const onSeparator = event => {
    setState({...state, separator:event.target.textContent })
  }
  const onSkipLines = event => {
    event.preventDefault();
    let lineNum = event.target.value;
    lineNum > 2
    ? setState({
      ...state,
      skipLines: event.target.value,
      lengthString: lineArray[event.target.value-2]
    })

    : setState({
      ...state,
      skipLines: lineNum,
      lengthString: ""
    })
  }

  const {getLength, lengthArray,skipLines,fileLoaded,lengthString, lineArray, separator} = state;

  const handleFileChosen = (file) => {

    let fileReader = new FileReader();
    let lineArr = [];
    fileReader.onloadend = (e) => {
      const content = fileReader.result;
      lineArr = content.split("\r\n");
      setState({...state, lengthString:lineArr[skipLines-2], fileLoaded:true, lineArray:lineArr });
    };
    fileReader.readAsText(file);
  };

  const getXls = () =>{
    let columnLength=[];
    if(getLength&&lengthString){
      columnLength = lengthString.split(separator).map(e=> e.length);
    } else if (!getLength && lengthArray) {
      columnLength = lengthArray.match(/\d{1,2}/g).map(Number);
    }
    else {alert('Неверный формат данных!')}
    createData(columnLength)

  }

  const createData = (columnLength) => {

    let data = [];
    for (let i = 0; i<lineArray.length; i++) {
      let line = lineArray[i];
      if(line.startsWith('~000')){
      i = i + skipLines-1;
      } else {

      let splitArr = columnLength.reduce((acc, current) => {
        acc.push(line.slice(0, current));
        line = line.substring(current + 1);
        return acc
      }, []);

      let res = splitArr.map(val => {
        return {value: val, type: 'string'}
      })
      data.push(res);
    }
    };
    createXls(data);
  }

  return (<Fragment>

      <Grid container spacing={3} >
      <Grid item xs={12}>
        <input accept=".txt" style={{
            display: 'none'
          }}
          id="outlined-button-file"
          multiple="multiple"
          type="file"
          onChange={e => handleFileChosen(e.target.files[0])}/>
        <label htmlFor="outlined-button-file">
          <Button variant="outlined" component="span">
            Upload
          </Button>
        </label>
        {
          fileLoaded && <Typography>
              Файл выбран</Typography>
        }
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          label="Строк в заголовке"
          value={skipLines}
          onChange={onSkipLines}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
          disabled={!fileLoaded}/>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
           value={lengthArray}
           onChange={handleChange('lengthArray')}
           margin = 'normal'
           name="lengthArray"
           label="Ширина столбцов"
           fullWidth
           variant='outlined'
           disabled={!fileLoaded}/>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          disabled={!fileLoaded}
          control={
            <Checkbox
          checked = {
            getLength
          }
          onChange = {
            handleCheckbox('getLength')
          }
          value = "getLength"
          color = "primary"
          />} label="Взять длину столбцов из заголовка"/>
      </Grid>
      {(fileLoaded && getLength) && (
        <Grid item xs={12}>
          <TextField
             value={lengthString}
             onChange={handleChange('lengthString')}
             margin = 'normal'
             name="lengthString"
             label="Строка из которой возьмутся значения"
             fullWidth
             variant='outlined'/>
           <Typography variant='caption'>По умолчанию разделителем является двоеточие. Вы можете ввести другой разделитель ниже: </Typography>
             <p contentEditable onInput={onSeparator} style={{width: '25px', height: '20px', border: '1px solid lightgrey', padding: '5px', borderRadius:'5px'}}>

             </p>
        </Grid>

      )}
      <Grid item xs={12}>
        <Button
          disabled={!fileLoaded || !(lengthArray || getLength)}
           variant="outlined"
           onClick={getXls}
           color='primary'>
           Получить xls
        </Button>
        {(!fileLoaded) ?  <Typography  style={{marginLeft: '10px'}} color='error'  variant='caption'> Не выбран файл</Typography>
          : !(lengthArray || getLength) ? <Typography style={{marginLeft: '10px'}} color='error'  variant='caption'> Заполните ширину столбцов или строку заголовка</Typography>
          : null
      }

      </Grid>
    </Grid>
  </Fragment>);
}
export default FormSettings
