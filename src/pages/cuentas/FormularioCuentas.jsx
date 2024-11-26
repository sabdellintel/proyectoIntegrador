import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './cuentas.module.css';
import { Exito, Error } from '../../components';
import { useUserContext } from '../../hooks/useUserContext';

function blockInvalidChar(e) {
	['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
	e.key;
}

export const FormularioCuentas = ({ esUsuarioNuevo, inicioDeSesionSeleccionado }) => {
	const [nombreUsuario, setNombreUsuario] = useState('');
	const [contrasenia, setContrasenia] = useState('');
	const [saldoInicial, setSaldoInicial] = useState('');
	// estado feedback
	const [mensajeFeedback, setMensajeFeedback] = useState('');
	const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
	const [mostrarMensajeError, setMostrarMensajeError] = useState(false);
	// estado contexto
	const { usuarios, setUsuarioActual, usuarioActual, updateUsuarios } = useUserContext();
	// para navegar a otra URL

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
	const validarCampos = (isLogin = false) => {
		const usuarioExistente = usuarios[nombreUsuario.toLowerCase()];
		if (isLogin) {
			if (!usuarioExistente || contrasenia !== usuarioExistente.password) {
				mostrarFeedback('error', 'Hay campos inválidos. Por favor, verifica la información proporcionada.');
				return false;
			}
		} else {
			const errores = [
				[
					nombreUsuario.length < 3 || contrasenia.length < 3,
					'El nombre de usuario y la contraseña deben tener al menos 3 caracteres.'
				],
				[isNaN(saldoInicial) || saldoInicial <= 0, 'El saldo inicial debe ser un número válido y mayor a 0.'],
				[usuarioExistente, 'El nombre de usuario ya está en uso. Por favor, elige otro.']
			];

			const error = errores.find((e) => e[0]);
			if (error) {
				mostrarFeedback('error', error[1]);
				return false;
			}
		}
		return true;
	};

	const registrarUsuario = () => {
		if (validarCampos()) {
			const usuariosActualizado = usuarios;
			usuariosActualizado[nombreUsuario.toLowerCase()] = {
				nombre: nombreUsuario,
				password: contrasenia,
				saldo: saldoInicial,
				historialTransferencias: [],
				historialPrestamos: [],
				historialPagos: []
			};
			updateUsuarios(usuariosActualizado);
			setUsuarioActual(nombreUsuario);
			localStorage.setItem('usuarioActual', nombreUsuario);
			window.location.href = '/';
		}
	};

	const iniciarSesion = () => {
		if (validarCampos(true)) {
			setUsuarioActual(usuarioActual);
			localStorage.setItem('usuarioActual', nombreUsuario);
			window.location.href = '/';
		}
	};
	return (
		<>
			<h2>{esUsuarioNuevo && !inicioDeSesionSeleccionado ? 'Formulario de registro' : 'Formulario de inicio'}</h2>
			<form id="form-acceso" method="post">
				<div className={styles.cuentasFromGroup}>
					<label htmlFor="nombre-usuario">Nombre de Usuario:</label>
					<input
						type="text"
						id="nombre-usuario"
						name="nombre-usuario"
						value={nombreUsuario}
						onChange={(e) => setNombreUsuario(e.target.value)}
						placeholder="Ingrese el nombre de usuario"
						required
						minLength={3}
					/>
				</div>
				<div className={styles.cuentasFromGroup}>
					<label htmlFor="contraseña">Contraseña:</label>
					<input
						type="password"
						id="contraseña"
						name="contraseña"
						value={contrasenia}
						onChange={(e) => setContrasenia(e.target.value)}
						placeholder="Ingrese la contraseña"
						required
						minLength={6}
					/>
				</div>
				{esUsuarioNuevo && !inicioDeSesionSeleccionado ? (
					<div className={styles.cuentasFromGroup} id="saldo-inicial-group">
						<label htmlFor="saldo-inicial">Saldo Inicial:</label>
						<input
							type="number"
							id="saldo-inicial"
							name="saldo-inicial"
							onKeyDown={blockInvalidChar}
							value={saldoInicial}
							onChange={(e) => setSaldoInicial(e.target.value)}
							placeholder="Ingrese el saldo inicial"
							required
						/>
					</div>
				) : null}
				<div className={styles.cuentasFormButtons}>
					{esUsuarioNuevo && !inicioDeSesionSeleccionado ? (
						<button type="button" onClick={registrarUsuario}>
							Registrarse
						</button>
					) : (
						<button type="button" onClick={iniciarSesion}>
							Ingresar
						</button>
					)}
				</div>
			</form>
			{mostrarMensajeExito && <Exito message={mensajeFeedback} />}
			{mostrarMensajeError && <Error message={mensajeFeedback} />}
		</>
	);
};

FormularioCuentas.propTypes = {
	esUsuarioNuevo: PropTypes.bool,
	inicioDeSesionSeleccionado: PropTypes.bool
};
