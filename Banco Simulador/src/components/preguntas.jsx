import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Preguntas = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 22, mb: 15 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontSize: '2.5rem', fontWeight: 'bold', mb: 4 }}>
        Preguntas Frecuentes
      </Typography>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
            ¿Para qué sirve el simulador?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Un simulador de crédito se utiliza para estimar las cuotas mensuales y el costo total de un préstamo, así puedes evaluar diferentes opciones antes de tomar una decisión.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
            ¿Los valores son los finales?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontSize: '1.5rem' }}>
            No, estos son referenciales. Cuando ya lo solicites, te darán el valor final.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
            ¿Puedo simular más de una vez?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Claro, el simulador está para que revises diferentes opciones de créditos y veas ahí si puedes pagar las cuotas mensuales.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};
