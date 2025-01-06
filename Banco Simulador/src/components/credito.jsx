// src/components/credito.jsx
import React, { useState } from 'react';
import {
  Container, Typography, Grid, TextField, Select, MenuItem, FormControl, Button, Box, Divider, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import { calcularAmortizacion } from '../funciones/amortizacion';
//import { generatePDF } from '../funciones/pdf_generator/pdf_builder';

export const Credito = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(''); // Inicialización de error
  const [selectedValues, setSelectedValues] = useState({
    method: 'f',
    product: 'Preciso',
    months: 3,
    interestRate: 15.6,
    capital: "",
    totalInterest: 0,
    insurance: 0,
  });

  const [simulacionRealizada, setSimulacionRealizada] = useState(false);
  const [tablaAmortizacion, setTablaAmortizacion] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Validación para deshabilitar el botón de simulación
  const isSimularDisabled = !selectedValues.capital || error;

  // Función para manejar cambios en los campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSimulacionRealizada(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    setIsLoading(true); // Mostrar el modal de espera

    const data = {
      nombreCredito: selectedValues.product, 
      metodo: selectedValues.method === "f" ? "FRANCÉS" : "ALEMÁN", 
      tasaAnual: selectedValues.interestRate, 
      monto: selectedValues.capital, 
      periodoMeses: selectedValues.months, 
      seguro: selectedValues.insurance, 
      tabla: tablaAmortizacion, 
      totalInteres: selectedValues.totalInterest
    };
    
    try {
      const response = await fetch("http://localhost:4000/creditos/reporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Tabla Amortizacion - C. ${data.nombreCredito} (${data.metodo}).pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error al generar el PDF");
      }
    } catch (error) {
      console.error("Error de conexión", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validación de entrada para el campo de capital
  const handleCapitalChange = (e) => {
    let value = e.target.value;

    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = parseFloat(value);

      if (numericValue < 300 && numericValue > 0) {
        setError('El valor mínimo es 300');
      } else if (numericValue > 40000) {
        setError('El valor máximo es 40000');
      } else {
        setError('');
      }

      setSelectedValues((prevState) => ({
        ...prevState,
        capital: value === '' ? '' : value,
      }));
      setSimulacionRealizada(false);
    }
  };

  // Función para realizar la simulación
  const handleSimulate = () => {
    if (error || !selectedValues.capital) return; // Evita la simulación si hay error

    const { method, interestRate, capital, months, insurance } = selectedValues;
    const totalInsurance = parseFloat(capital) * 0.01;
    const [tabla, totalInterest] = calcularAmortizacion(
      method,
      interestRate / 100,
      parseFloat(capital),
      months,
      totalInsurance
    );

    setTablaAmortizacion(tabla);
    setSelectedValues((prevState) => ({
      ...prevState,
      insurance: totalInsurance.toFixed(2),
      totalInterest,
    }));
    setSimulacionRealizada(true);
  };

  const columns = [
    { id: 'mes', label: 'Número de cuota', width: '50px' },
    { id: 'capital', label: 'Capital', width: '150px' },
    { id: 'interes', label: 'Interés', width: '150px' },
    { id: 'tasaSeguro', label: 'Seguro desgravamen', width: '150px' },
    { id: 'cuota', label: 'Cuota', width: '150px' },
    { id: 'saldo', label: 'Saldo', width: '150px' },
  ];

  const rows = tablaAmortizacion;

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          ¿Qué crédito necesitas?
        </Typography>
        <FormControl style={{ minWidth: 300 }}>
          <Select
            name="interestRate"
            value={selectedValues.interestRate}
            onChange={handleChange}
            sx={{ fontSize: 'medium' }}
          >
            <MenuItem sx={{ fontSize: 'medium' }} value={15.6}>Preciso</MenuItem>
            <MenuItem sx={{ fontSize: 'medium' }} value={13}>Línea abierta</MenuItem>
            <MenuItem sx={{ fontSize: 'medium' }} value={10.75}>Hipotecario vivienda</MenuItem>
            <MenuItem sx={{ fontSize: 'medium' }} value={4.87}>Vivienda de interés público</MenuItem>
            <MenuItem sx={{ fontSize: 'medium' }} value={4.87}>Vivienda de interés social</MenuItem>
            <MenuItem sx={{ fontSize: 'medium' }} value={9}>Educación superior</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h4" gutterBottom sx={{ my: 2 }}>
          Ingresa los siguientes datos para empezar la simulación
        </Typography>
      </Container>

      <Container maxWidth="md" sx={{ mt: 3, textAlign: 'left' }}>
        <Divider sx={{ my: 2, minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px' }} />

        <Grid container spacing={9}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6" style={{ fontWeight: 800, fontSize: 14 }}>
                ¿Cuánto dinero necesitas que te prestemos?
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Min. $300.00"
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
                ¿En cuánto tiempo quieres pagarlo?
              </Typography>
              <Select
                name="months"
                value={selectedValues.months}
                onChange={handleChange}
                sx={{ fontSize: 'medium' }}
              >
                {[...Array(20).keys()].map(i =>
                  <MenuItem key={i + 3} sx={{ fontSize: 'medium' }} value={i + 3}>{i + 3} meses</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography variant="h6" style={{ fontWeight: 800, fontSize: 14 }}>
                ¿Cómo quieres pagar tus intereses?
              </Typography>
              <Select
                name="method"
                value={selectedValues.method}
                onChange={handleChange}
                sx={{ fontSize: 'medium' }}
              >
                <MenuItem sx={{ fontSize: 'medium' }} value="f">Método Francés (Cuotas fijas)</MenuItem>
                <MenuItem sx={{ fontSize: 'medium' }} value="a">Método Alemán (Cuotas variables)</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained"
              fullWidth sx={{ mt: 2 }}
              style={{ fontSize: 16, backgroundColor: isSimularDisabled ? '#e5e5e5' : '#2e3673' }}
              onClick={handleSimulate}
              disabled={isSimularDisabled}
            >
              Simular
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', backgroundColor: '#f9f9f9', p: 2, borderRadius: 1 }}>
              <Typography variant="h4">Tus pagos mensuales serán</Typography>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", gap: '2.5rem' }}>
                <Grid>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>${simulacionRealizada ? parseFloat(rows[0].capital).toFixed(2) : 0}</Typography>
                  <Typography variant="h6">Capital</Typography>
                </Grid>
                <Typography variant="h5" style={{ fontWeight: 600 }}>+</Typography>
                <Grid>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>${simulacionRealizada ? parseFloat(rows[0].interes).toFixed(2) : 0}</Typography>
                  <Typography variant="h6">Interés</Typography>
                </Grid>
                <Typography variant="h5" style={{ fontWeight: 600 }}>+</Typography>
                <Grid>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>${simulacionRealizada ? parseFloat(rows[0].tasaSeguro).toFixed(2) : 0}</Typography>
                  <Typography variant="h6">Seguro</Typography>
                </Grid>
              </div>

              <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                ${simulacionRealizada ? (parseFloat(rows[0].capital) + parseFloat(rows[0].interes) + parseFloat(rows[0].tasaSeguro)).toFixed(2) : "0.00"}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Durante <span style={{ fontWeight: 800 }}>{simulacionRealizada ? `${selectedValues.months} meses (${(selectedValues.months / 12).toPrecision(2)} años)` : "0 meses"}</span>
              </Typography>
              <Typography variant="h6">
                Con una tasa de interés referencial <span style={{ fontWeight: 800 }}>{simulacionRealizada ? selectedValues.interestRate : 0}%</span>
              </Typography>

              <Divider sx={{ my: 2, minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px' }} />

              <Button
                variant="outlined"
                fullWidth
                onClick={handleOpen}
                sx={{ my: 2 }}
                style={{ fontSize: 16, color: '#fff', backgroundColor: '#333', display: simulacionRealizada ? 'inline-block' : 'none' }}
              >
                Ver tabla de amortización
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="x">
          <DialogTitle>
            <div style={{ textAlign: 'center', backgroundColor: '#fbd800' }}>
              <img src="./img/encabezado.png" alt="Encabezado" style={{ width: '40%' }} />
            </div>
          </DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minHeight: '55vh' }}>
            <Typography variant="h3">Tabla de Amortización</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>Método: {selectedValues.method == "f" ? 'Francés' : 'Alemán'}</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'left', width: '45%', marginLeft: '10%' }}>
              <Typography style={{ fontSize: '1.8rem' }}><strong>Producto:</strong> {selectedValues.product}</Typography>
              <Typography style={{ fontSize: '1.8rem' }}><strong>Plazo (meses):</strong> {selectedValues.months}</Typography>
              <Typography style={{ fontSize: '1.8rem' }}><strong>Tasa de interés nominal:</strong> {selectedValues.interestRate}%</Typography>
              <Typography style={{ fontSize: '1.8rem' }}><strong>Capital:</strong> ${selectedValues.capital}</Typography>
              <Typography style={{ fontSize: '1.8rem' }}><strong>Total de interés:</strong> ${selectedValues.totalInterest}</Typography>
              <Typography style={{ fontSize: '1.8rem' }}><strong>Total seguro de desgravamen:</strong> ${selectedValues.insurance}</Typography>
            </div>

            <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
              <Table stickyHeader aria-label="Amortización">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          fontSize: '1.6rem',
                          textAlign: 'center',
                          fontWeight: '800',
                          border: '1px solid black',
                          backgroundColor: '#fbd800',
                          width: column.width || 'auto',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#dededf' : '#FAFAFA'
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          sx={{
                            fontSize: '1.6rem',
                            textAlign: 'center',
                            border: '1px solid black',
                            width: column.width || 'auto'
                          }}
                        >
                          {row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


            <Button
              sx={{ m: 2, fontSize: 16, backgroundColor: '#2e3673', color: 'white', width: '250px' }}
              onClick={handleDownload}>
              Descargar tabla
            </Button>
            {isLoading && (
              <div className="modal">
                <div className="modal-content">
                  <p>⏳Generando PDF, por favor espera...</p>
                </div>
              </div>
            )}
            <style>
              {`
                /* Estilos básicos para el modal */
                .modal {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.5);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 1000;
                }
                .modal-content {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                }
              `}
            </style>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};
