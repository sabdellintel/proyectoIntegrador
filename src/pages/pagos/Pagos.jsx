import { useState } from 'react';
import styles from './pagos.module.css';
import { useUserContext } from '../../hooks/useUserContext';
import { Exito, Error } from '../../components';

function blockInvalidChar(e) {
	['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
	e.key;
}

export const Pagos = () => {
	const [numeroFactura, setNumeroFactura] = useState('');
	const [monto, setMonto] = useState('');
	const [metodoPago, setMetodoPago] = useState(0);
	const [mensajeFeedback, setMensajeFeedback] = useState('');
	const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
	const [mostrarMensajeError, setMostrarMensajeError] = useState(false);
	const { usuarioActual, usuarios, updateUsuarios } = useUserContext();
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
	const handleSubmit = (event) => {
		event.preventDefault();
		if (monto > usuarios[usuarioActual.toLowerCase()].saldo) {
			mostrarFeedback('error', 'Saldo insuficiente.');
			return;
		}
		if (monto < 0) {
			mostrarFeedback('error', 'El monto a transferir debe ser mayor a 0.');
			return;
		}
		if (numeroFactura !== '' && monto > 0 && metodoPago) {
			const usuariosActualizado = usuarios;
			const id = Math.random().toString(16).slice(2);
			usuariosActualizado[usuarioActual.toLowerCase()].saldo -= monto;
			usuariosActualizado[usuarioActual.toLowerCase()].historialPagos.push({
				numero: numeroFactura,
				monto,
				metodo: metodoPago,
				fecha: new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD
				id
			});
			updateUsuarios(usuariosActualizado);
			mostrarFeedback('exito', 'Pago realizado con éxito');
			return;
		} else {
			mostrarFeedback('error', 'Por favor corrija los campos e intente nuevamente.');
		}
	};

	return (
		<section className={styles.pagos}>
			<h2>Pago de Factura</h2>
			<form onSubmit={handleSubmit} action="/procesar-pago" method="post">
				<div className={styles.pagosFormGroup}>
					<label htmlFor="numero-factura">Número de Factura:</label>
					<input
						type="text"
						id="numero-factura"
						name="numero-factura"
						placeholder="Ingrese el número de factura"
						value={numeroFactura}
						onChange={(e) => setNumeroFactura(e.target.value)}
						required
					/>
				</div>
				<div className={styles.pagosFormGroup}>
					<label htmlFor="monto">Monto a Pagar:</label>
					<input
						value={monto}
						onKeyDown={blockInvalidChar}
						onChange={(e) => {
							setMonto(() => e.target.value);
						}}
						type="number"
						id="monto"
						name="monto"
						required
						min="0"
						placeholder="Ingrese el monto"
					/>
				</div>
				<div className={styles.pagosFormGroup}>
					<label htmlFor="metodo-pago">Método de Pago:</label>
					<select
						value={metodoPago}
						onChange={(e) => setMetodoPago(() => e.target.value)}
						id="metodo-pago"
						name="metodo-pago"
						required>
						<option value="">Seleccione un método</option>
						<option value="tarjeta-debito">Tarjeta de Débito</option>
						<option value="tarjeta-credito">Tarjeta de Crédito</option>
						<option value="transferencia">Transferencia Bancaria</option>
						<option value="paypal">PayPal</option>
					</select>
				</div>
				<div className={styles.pagosFormGroup}>
					<button type="submit">Realizar Pago</button>
				</div>
			</form>
			{mostrarMensajeExito && <Exito message={mensajeFeedback} />}
			{mostrarMensajeError && <Error message={mensajeFeedback} />}
		</section>
	);
};
