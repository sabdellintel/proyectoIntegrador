import { useState } from 'react';
import styles from './prestamos.module.css';
import { useUserContext } from '../../hooks/useUserContext';
import { Exito, Error } from '../../components';

function blockInvalidChar(e) {
	['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
	e.key;
}

export const SolicitarPrestamo = () => {
	// Estados para los valores del simulador
	const [loanType, setLoanType] = useState('');
	const [amount, setAmount] = useState('');
	const [interestRate, setInterestRate] = useState('');
	const [term, setTerm] = useState('');
	const [monthlyPayment, setMonthlyPayment] = useState('');
	const [totalPayment, setTotalPayment] = useState('');
	// valores feedback
	const [mensajeFeedback, setMensajeFeedback] = useState('');
	const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
	const [mostrarMensajeError, setMostrarMensajeError] = useState(false);
	// contexto
	const { usuarios, updateUsuarios, usuarioActual } = useUserContext();
	// Función para abrir el simulador con un tipo de préstamo y tasa de interés
	const openSimulator = (loanType, interestRate) => {
		setLoanType(loanType);
		setInterestRate(interestRate);
		setAmount('');
		setTerm('');
		setMonthlyPayment('');
		setTotalPayment('');
	};

	const mostrarFeedback = (tipo, message) => {
		setMensajeFeedback(message);
		const esExito = tipo === 'exito';
		setMostrarMensajeExito(esExito);
		setMostrarMensajeError(!esExito);

		setTimeout(() => {
			setMostrarMensajeExito(false);
			setMostrarMensajeError(false);
		}, 3000);
	};

	// Función para calcular el préstamo
	const validateLoan = (parsedAmount, parsedInterestRate, parsedTerm) => {
		if (!amount === '' || !parsedInterestRate || !parsedTerm) {
			mostrarFeedback('error', `Por favor, rellena todos los campos del formulario.`);
			return false;
		}
		if (isNaN(parsedAmount)) {
			mostrarFeedback('error', `El monto [${amount}] no es un número valido.`);
			return false;
		}
		if (parsedAmount <= 0) {
			mostrarFeedback('error', `El monto debe ser mayor a 0.`);
			return false;
		}
		return true;
	};
	const calculateLoan = () => {
		const parsedAmount = parseFloat(amount);
		const parsedInterestRate = parseFloat(interestRate);
		const parsedTerm = parseInt(term);

		if (validateLoan(parsedAmount, parsedInterestRate, parsedTerm)) {
			setMostrarMensajeError(false);
			const monthlyInterest = parsedInterestRate / 100 / 12;
			const numberOfPayments = parsedTerm;
			const calculatedMonthlyPayment =
				(parsedAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
			const calculatedTotalPayment = calculatedMonthlyPayment * numberOfPayments;
			setMonthlyPayment(`Cuota Mensual: $${calculatedMonthlyPayment.toFixed(2)}`);
			setTotalPayment(`Pago Total: $${calculatedTotalPayment.toFixed(2)}`);
		}
	};
	const submitLoan = () => {
		const parsedAmount = parseFloat(amount);
		const parsedInterestRate = parseFloat(interestRate);
		const parsedTerm = parseInt(term);

		if (
			validateLoan(parsedAmount, parsedInterestRate, parsedTerm) &&
			confirm('¿Estás seguro de que quieres solicitar el prestamo?')
		) {
			const usuariosActualizado = usuarios;
			const id = Math.random().toString(16).slice(2);
			usuariosActualizado[usuarioActual.toLowerCase()].saldo =
				parseFloat(usuariosActualizado[usuarioActual.toLowerCase()].saldo) + parsedAmount;
			usuariosActualizado[usuarioActual.toLowerCase()].historialPrestamos.push({
				monto: parsedAmount,
				tipo: loanType,
				tasaInteres: parsedInterestRate,
				plazo: parsedTerm,
				fecha: new Date().toISOString().slice(0, 10),
				id
			});
			updateUsuarios(usuariosActualizado);
			mostrarFeedback('exito', 'Préstamo solicitado exitosamente.');
		}
	};
	return (
		<section className={styles.prestamos}>
			<h1>Préstamos Disponibles</h1>
			<p>Encuentra la mejor opción de financiamiento para tus necesidades.</p>
			<br />

			<div className={styles.loanOptions}>
				<div className={styles.loanCard}>
					<h3>Préstamo Personal</h3>
					<ul>
						<li>Tasa de interés: 12% anual</li>
						<li>Monto máximo: $100.000</li>
						<li>Plazo: Hasta 24 meses</li>
					</ul>
					<button onClick={() => openSimulator('Préstamo Personal', 12)}>Simular</button>
				</div>

				<div className={styles.loanCard}>
					<h3>Préstamo Hipotecario</h3>
					<ul>
						<li>Tasa de interés: 8% anual</li>
						<li>Monto máximo: $500.000</li>
						<li>Plazo: Hasta 48 meses</li>
					</ul>
					<button onClick={() => openSimulator('Préstamo Hipotecario', 8)}>Simular</button>
				</div>

				<div className={styles.loanCard}>
					<h3>Préstamo Prendario</h3>
					<ul>
						<li>Tasa de interés: 9% anual</li>
						<li>Monto máximo: $50.000</li>
						<li>Plazo: Hasta 12 meses</li>
					</ul>
					<button onClick={() => openSimulator('Préstamo Automotriz', 9)}>Simular</button>
				</div>
			</div>

			<div className={styles.loanSimulator}>
				<h2>Formulario de solicitud de prestamo</h2>
				<form id="simulator-form" onSubmit={(e) => e.preventDefault()}>
					<div className={styles.formGroup}>
						<label htmlFor="loan-type">Tipo de Préstamo:</label>
						<input
							onClick={() => {
								alert('Para rellenar este campo debes seleccionar una de las opciones de prestamos.');
							}}
							type="text"
							id="loan-type"
							name="loan-type"
							value={loanType}
							readOnly
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="amount">Monto:</label>
						<input
							type="number"
							id="amount"
							name="amount"
							placeholder="Ingrese el monto del préstamo"
							value={amount}
							onKeyDown={blockInvalidChar}
							onChange={(e) => {
								setAmount(() => e.target.value);
							}}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="interest-rate">Tasa de Interés (%):</label>
						<input
							onClick={() => {
								alert('Para rellenar este campo debes seleccionar una de las opciones de prestamos.');
							}}
							type="number"
							id="interest-rate"
							name="interest-rate"
							value={interestRate}
							readOnly
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="term">Plazo (meses):</label>
						<input
							type="number"
							id="term"
							name="term"
							placeholder="Ingrese el plazo en meses"
							value={term}
							onChange={(e) => setTerm(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formButtons}>
						<button className={styles.requestLoan} type="button" onClick={() => submitLoan()}>
							Solicitar
						</button>
						<button className={styles.calculateLoan} type="button" onClick={() => calculateLoan()}>
							Calcular <span className="material-symbols-outlined  icon">calculate</span>
						</button>
					</div>
				</form>
				{mostrarMensajeExito && <Exito message={mensajeFeedback} />}
				{mostrarMensajeError && <Error message={mensajeFeedback} />}
				<div className={styles.results} id="results">
					<p id="monthly-payment">{monthlyPayment}</p>
					<p id="total-payment">{totalPayment}</p>
				</div>
			</div>
		</section>
	);
};
