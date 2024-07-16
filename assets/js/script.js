async function obtenerTiposDeCambio() {
    try {
        const respuesta = await fetch('https://mindicador.cl/api');
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        mostrarError('No se pudieron obtener los datos de la API.');
    }
}

async function obtenerHistorial(moneda) {
    try {
        const respuesta = await fetch(`https://mindicador.cl/api/${moneda}`);
        const datos = await respuesta.json();
        return datos.serie.slice(0, 10); // Obtener los últimos 10 días
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        mostrarError('No se pudieron obtener los datos históricos de la API.');
    }
}

async function convertirMoneda() {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;
    const tiposDeCambio = await obtenerTiposDeCambio();
    if (tiposDeCambio && tiposDeCambio[moneda]) {
        const tasaDeCambio = tiposDeCambio[moneda].valor;
        const resultado = monto / tasaDeCambio;
        document.getElementById('resultado').textContent = `Resultado: ${resultado.toFixed(2)}`;
        mostrarGrafico(moneda);
    } else {
        mostrarError('Error al calcular el tipo de cambio.');
    }
}

function mostrarError(mensaje) {
    document.getElementById('resultado').textContent = mensaje;
}

async function mostrarGrafico(moneda) {
    const historial = await obtenerHistorial(moneda);
    if (historial) {
        const valores = historial.map(d => d.valor);
        const fechas = historial.map(d => new Date(d.fecha).toLocaleDateString());

        const ctx = document.getElementById('grafico').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: `Historial últimos 10 días (${moneda})`,
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });
    } else {
        mostrarError('Error al obtener el historial para el gráfico.');
    }
}
