// src/components/inversion.jsx
import React, { useState } from 'react';
import {
  Container, Typography, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Box, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import { calcularInversión } from '../funciones/inversiones';

const tablaInteres = [
  [4.20, 4.80, 6.50, 6.60, 6.70, 6.85, 6.90],
  [4.30, 4.90, 6.60, 6.70, 6.80, 6.90, 7.00],
  [4.40, 4.95, 6.75, 6.80, 6.90, 7.00, 7.10],
  [6.65, 6.75, 6.85, 6.90, 7.00, 7.10, 7.20],
  [6.75, 6.85, 6.95, 7.00, 7.10, 7.20, 7.30],
  [6.85, 6.95, 7.05, 7.10, 7.20, 7.30, 7.40],
  [6.95, 7.05, 7.15, 7.20, 7.30, 7.40, 7.50],
  [7.05, 7.15, 7.25, 7.30, 7.40, 7.50, 7.60]
];

const montos = [
  "$500 — $4,999.99",
  "$5,000 — $9,999.99",
  "$10,000 — $49,999.99",
  "$50,000 — $99,999.99",
  "$100,000 — $199,999.99",
  "$200,000 — $499,999.99",
  "$500,000 — $1,000,000.00"
];

const plazos = [
  "31 a 60 días",
  "61 a 90 días",
  "91 a 120 días",
  "121 a 180 días",
  "181 a 240 días",
  "241 a 300 días",
  "301 a 360 días",
  "361 a 720 días"
];

export const Inversion = () => {
  const [selectedValues, setSelectedValues] = useState({
    capital: '',
    term: '',
    termType: 'days', // 'days' or 'months'
  });
  const [calculedValues, setCalculedValues] = useState({
    plazo: 0,
    monto: 0,
    tasa: 0,
    interes: 0,
    valorFuturo: 0
  });
  const [error, setError] = useState(''); // Estado para el mensaje de error del capital
  const [termError, setTermError] = useState(''); // Estado para el mensaje de error del plazo
  const [openInterestRates, setOpenInterestRates] = useState(false); // Controla el modal

  const isSimularDisabled = !selectedValues.capital || !selectedValues.term || error || termError;

  const handleCapitalChange = (e) => {
    let value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = parseFloat(value);
      if (numericValue < 500 && numericValue > 0) {
        setError('El valor mínimo es 500.00');
      } else if (numericValue > 1000000) {
        setError('El valor máximo es 1,000,000.00');
      } else {
        setError('');
      }
      setSelectedValues((prevState) => ({
        ...prevState,
        capital: value === '' ? '' : value,
      }));
    }
    setCalculedValues({
      plazo: 0,
      monto: 0,
      tasa: 0,
      interes: 0,
      valorFuturo: 0
    });
  };

  const handleTermChange = (e) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (selectedValues.termType === 'days') {
        if (numericValue < 31 && numericValue > 0) {
          setTermError('El plazo mínimo es de 31 días.');
        } else if (numericValue > 720) {
          setTermError('El plazo máximo es de 720 días.');
        } else {
          setTermError('');
        }
      } else {
        if (numericValue < 1 && numericValue > 0) {
          setTermError('El plazo mínimo es de 1 mes.');
        } else if (numericValue > 24) {
          setTermError('El plazo máximo es de 24 meses.');
        } else {
          setTermError('');
        }
      }
      setSelectedValues((prevState) => ({
        ...prevState,
        term: value === '' ? '' : value,
      }));
    }
    setCalculedValues({
      plazo: 0,
      monto: 0,
      tasa: 0,
      interes: 0,
      valorFuturo: 0
    });
  };

  const handleTermTypeChange = (e) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      termType: e.target.value,
      term: '', // Reinicia el valor del plazo cuando cambia la unidad
    }));
    setTermError(''); // Reinicia el mensaje de error cuando se cambia la unidad
  };

  const handleOpenInterestRates = () => {
    setOpenInterestRates(true);
  };

  const handleCloseInterestRates = () => {
    setOpenInterestRates(false);
  };

  const simularInversion = () => {
    let plazo = parseInt(selectedValues.term);
    if ( selectedValues.termType === 'months' ) {
      plazo = plazo * 30;
    }
    const monto = parseFloat(selectedValues.capital);
    console.log(calcularInversión(plazo, monto));
    setCalculedValues(calcularInversión(plazo, monto));
  }

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Invierte con nosotros
        </Typography>
        <Divider sx={{ my: 2, minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px' }} />
        <Typography variant="h4" gutterBottom sx={{ my: 2 }}>
          Ingresa los siguientes datos para empezar la simulación
        </Typography>
        <Divider sx={{ my: 2, minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px' }} />
      </Container>
      <Grid container spacing={1} maxWidth={'md'} sx={{ margin: '0 auto', alignItems: 'center' }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6" style={{ fontWeight: 800, fontSize: 14 }}>
                ¿Cuánto dinero deseas invertir?
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Min. $500.00"
                fullWidth
                value={selectedValues.capital}
                onChange={handleCapitalChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 16 } }}
                error={!!error}
                helperText={error}
                FormHelperTextProps={{
                  style: { fontSize: '1.2rem', color: 'red' },
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6" style={{ fontWeight: 800, fontSize: 14 }}>
                ¿Cuánto tiempo deseas tener en plazo tu inversión?
              </Typography>
              <RadioGroup
                row
                value={selectedValues.termType}
                onChange={handleTermTypeChange}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              >
                <FormControlLabel
                  value="days"
                  control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                  label="Días"
                  sx={{ '.MuiFormControlLabel-label': { fontSize: '1.5rem' } }}
                />
                <FormControlLabel
                  value="months"
                  control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                  label="Meses"
                  sx={{ '.MuiFormControlLabel-label': { fontSize: '1.5rem' } }}
                />
              </RadioGroup>
              <TextField
                variant="outlined"
                placeholder={`Min. ${selectedValues.termType === 'days' ? '31 días' : '1 mes'}`}
                fullWidth
                value={selectedValues.term}
                onChange={handleTermChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 16 } }}
                error={!!termError}
                helperText={termError}
                FormHelperTextProps={{
                  style: { fontSize: '1.2rem', color: 'red' },
                }}
              />
            </FormControl>
            <Typography style={{ fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontStyle: 'italic' }} 
              sx={{ mt: 1 }}
              onClick={handleOpenInterestRates}>
              Nuestras tasas de interés*
            </Typography>
            <Button 
              onClick={simularInversion}
              variant="contained" 
              fullWidth sx={{ mt: 3 }} 
              style={{ fontSize: 16, backgroundColor: isSimularDisabled ? '#e5e5e5' : '#2e3673' }}
              disabled={isSimularDisabled}
              >
              Simular
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center', backgroundColor: '#f6f6f6', borderRadius: '5%' }}>
          <Typography style={{ fontSize: 20 }}>
            En <strong>{ !isSimularDisabled ? calculedValues.plazo : '0'} {calculedValues.plazo > 30 ? 'días' : 'meses'}</strong> | Tasa <strong>{ !isSimularDisabled ? calculedValues.tasa : '0'}%</strong>
          </Typography>
          <Typography variant="h2" style={{ fontWeight: 700, fontSize: 40, margin: '8px 0' }}>
            Ganas: <strong>${ !isSimularDisabled ? calculedValues.interes : '0'}</strong>
          </Typography>
          <Typography style={{ fontSize: 25 }}>
            Recibes al final: <strong>${ !isSimularDisabled ? calculedValues.valorFuturo : '0'}</strong>
          </Typography>
        </Grid>
      </Grid>

      <Dialog open={openInterestRates} onClose={handleCloseInterestRates} maxWidth="md" fullWidth sx={{ textAlign: 'center' }}>
        <DialogTitle>
          <div style={{ textAlign: 'center', backgroundColor: '#fbd800' }}>
            <img src="./img/encabezado.png" alt="Encabezado" style={{ width: '50%' }} />
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" gutterBottom>
            Tasas de interés
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '1.4rem', fontWeight: 'bold', width: '130px', textAlign: 'center', backgroundColor: '#fbd800' }}>Plazo</TableCell>
                  {montos.map((rango, index) => (
                    <TableCell key={index} sx={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#dededf' }}>{rango}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tablaInteres.map((fila, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '1.3rem', fontWeight: 'bold', width: '130px', textAlign: 'center', backgroundColor: '#dededf' }}>{plazos[index]}</TableCell>
                    {fila.map((tasa, subIndex) => (
                      <TableCell key={subIndex} sx={{ fontSize: '1.5rem', textAlign: 'center' }}>{tasa}%</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

    </div>
  );
};
