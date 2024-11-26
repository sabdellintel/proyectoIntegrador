import { useState } from 'react';
import styles from './transferencias.module.css';
import { useUserContext } from '../../hooks/useUserContext';
import { Exito, Error } from '../../components';

function blockInvalidChar(e) {
	['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
	e.key;
}

export const Transferencias = () => {
	const [nombreUsuario, setNombreUsuario] = useState('');
	const [monto, setMonto] = useState('');
	const [motivoPago, setMotivoPago] = useState(0);
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
		if (nombreUsuario !== '' && monto > 0 && motivoPago) {
			const usuariosActualizado = usuarios;
			const id = Math.random().toString(16).slice(2);
			// actualizar usuario actual
			usuariosActualizado[usuarioActual.toLowerCase()].saldo -= monto;
			usuariosActualizado[usuarioActual.toLowerCase()].historialTransferencias.push({
				monto,
				motivo: motivoPago,
				emisor: usuarioActual,
				esIngreso: false,
				receptor: nombreUsuario,
				fecha: new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD
				id
			});
			// actualizar usuario receptor
			if (usuariosActualizado[nombreUsuario.toLowerCase()]) {
				usuariosActualizado[nombreUsuario.toLowerCase()].saldo =
					parseFloat(usuariosActualizado[nombreUsuario.toLowerCase()].saldo) + parseFloat(monto);
				usuariosActualizado[nombreUsuario.toLowerCase()].historialTransferencias.push({
					monto,
					motivo: motivoPago,
					emisor: usuarioActual,
					receptor: nombreUsuario,
					esIngreso: true,
					fecha: new Date().toISOString().slice(0, 10),
					id
				});
			}
			updateUsuarios(usuariosActualizado);
			mostrarFeedback('exito', 'Pago realizado con éxito');
			return;
		} else {
			mostrarFeedback('error', 'Por favor corrija los campos e intente nuevamente.');
		}
	};

	return (
		<section className={styles.transferencias}>
			<h2>Formulario de transferencias</h2>
			<form onSubmit={handleSubmit} action="/procesar-pago" method="post">
				<div className={styles.transferenciasFormGroup}>
					<label htmlFor="nombre-usuario">Nombre de usuario:</label>
					<input
						type="text"
						id="nombre-usuario"
						name="nombre-usuario"
						placeholder="Ingrese el número de factura"
						value={nombreUsuario}
						onChange={(e) => setNombreUsuario(e.target.value)}
						required
					/>
				</div>
				<div className={styles.transferenciasFormGroup}>
					<label htmlFor="monto">Monto a Transferir:</label>
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
				<div className={styles.transferenciasFormGroup}>
					<label htmlFor="motivo-pago">Motivo:</label>
					<select
						value={motivoPago}
						onChange={(e) => setMotivoPago(() => e.target.value)}
						id="motivo-pago"
						name="motivo-pago"
						required>
						<option value="">Seleccione un método</option>
						<option value="tarjeta-debito">Tarjeta de Débito</option>
						<option value="tarjeta-credito">Tarjeta de Crédito</option>
						<option value="transferencia">Transferencia Bancaria</option>
						<option value="paypal">PayPal</option>
					</select>
				</div>
				<div className={styles.transferenciasFormGroup}>
					<button type="submit">Realizar Transferencia</button>
				</div>
			</form>
			{mostrarMensajeExito && <Exito message={mensajeFeedback} />}
			{mostrarMensajeError && <Error message={mensajeFeedback} />}
		</section>
	);
};
