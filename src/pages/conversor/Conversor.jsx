import { useState } from 'react';
import styles from './conversor.module.css';

const options = [
	{ value: 'ARS', name: 'Peso argentino - ARS' },
	{ value: 'USD', name: 'Dólar - USD' },
	{ value: 'EUR', name: 'Euro - EUR' },
	{ value: 'BRL', name: 'Real brasileño - BRL' },
	{ value: 'UYU', name: 'Peso uruguayo - UYU' },
	{ value: 'PEN', name: 'Sol peruano - PEN' },
	{ value: 'BOB', name: 'Boliviano - BOB' },
	{ value: 'CLP', name: 'Peso chileno - CLP' }
];

export const Conversor = () => {
	const [monto, setMonto] = useState(1);
	const [monedaBase, setMonedaBase] = useState('ARS');
	const [monedaDestino, setMonedaDestino] = useState('USD');
	const [resultadoConversion, setResultadoConversion] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const convert = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`https://v6.exchangerate-api.com/v6/36dde4e6b38c9b70c649d23d/latest/${monedaBase}`);
			const data = await response.json();
			if (response.ok) {
				const rate = data.conversion_rates[monedaDestino];
				const resultadoFinal = (parseFloat(monto) * rate).toFixed(2);
				setResultadoConversion(resultadoFinal);
			} else {
				throw new Error('Error al recuperar los datos de la API');
			}
		} catch (error) {
			console.error('Error en la solicitud de conversión:', error.message);
			alert('Hubo un error al intentar realizar la conversión.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.converter}>
			<h1>Conversor de Divisas</h1>
			<div className={styles.conversionForm}>
				<div className={styles.inputGroup}>
					<label htmlFor="cantidad">Importe:</label>
					<input
						type="number"
						id="cantidad"
						name="cantidad"
						min="0"
						value={monto}
						onChange={(e) => setMonto(e.target.value)}
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="moneda-base">De:</label>
					<select
						id="moneda-base"
						name="moneda-base"
						value={monedaBase}
						onChange={(e) => setMonedaBase(e.target.value)}>
						{options.map(({ value, name }) => (
							<option key={value} value={value}>
								{name}
							</option>
						))}
					</select>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="moneda-destino">A:</label>
					<select
						id="moneda-destino"
						name="moneda-destino"
						value={monedaDestino}
						onChange={(e) => setMonedaDestino(e.target.value)}>
						{options.map(({ value, name }) =>
							value !== monedaBase ? (
								<option key={value} value={value}>
									{name}
								</option>
							) : null
						)}
					</select>
				</div>
				<button className={styles.convertButton} onClick={convert}>
					Convertir
				</button>
				{isLoading ? (
					<div className={styles.converterSpinner}></div>
				) : (
					resultadoConversion && <h2>Resultado: ${resultadoConversion}</h2>
				)}
			</div>
		</div>
	);
};
