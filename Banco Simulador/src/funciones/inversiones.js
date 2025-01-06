exports.calcularInversión = (plazo, monto) => {
    const [fila, columna] = getLocalizacionTasa(plazo, monto);
    const tasaAnual = (tablaInteres[fila][columna]) / 100;
    const interes = ((monto * tasaAnual) / 360) * plazo;
    return {
        plazo: plazo,
        monto: monto.toFixed(2),
        tasa: (tasaAnual * 100).toFixed(2),
        interes: (Math.round(interes * 100) / 100).toFixed(2),
        valorFuturo: (Math.round((monto + interes) * 100) / 100).toFixed(2)
    }
}

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

function getLocalizacionTasa(plazo, monto){
    let fila;
    let columna;

    if(plazo >= 31 && plazo <= 60){
        fila = 0;
    } else if(plazo <= 90){
        fila = 1;
    } else if(plazo <= 120){
        fila = 2;
    } else if(plazo <= 180){
        fila = 3;
    } else if(plazo <= 240){
        fila = 4;
    } else if(plazo <= 300){
        fila = 5;
    } else if(plazo <= 360){
        fila = 6;
    } else if (plazo > 360){
        fila = 7
    }

    if(monto >= 500 && monto < 5000){
        columna = 0;
    } else if(monto < 10000){
        columna = 1;
    } else if(monto < 50000){
        columna = 2;
    } else if(monto < 100000){
        columna = 3;
    } else if(monto < 200000){
        columna = 4;
    } else if(monto < 500000){
        columna = 5;
    } else if(monto <= 1000000){
        columna = 6;
    }

    return [fila, columna];
} 
