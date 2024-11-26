import { useState } from 'react';
import styles from './cuentas.module.css';
import { useUserContext } from '../../hooks/useUserContext';
import { FormularioCuentas } from './FormularioCuentas';

export const ToggleForms = () => {
	const { usuarioActual, setUsuarioActual } = useUserContext();
	const [esUsuarioNuevo, setEsUsuarioNuevo] = useState(usuarioActual === 'Demo');
	const [inicioDeSesionSeleccionado, setInicioDeSesionSeleccionado] = useState(false);
	// context estate
	const handleLogout = () => {
		setEsUsuarioNuevo(true);
		setUsuarioActual('Demo');
		setInicioDeSesionSeleccionado(false);
		localStorage.setItem('usuarioActual', 'Demo');
	};
	return (
		<>
			<div className={styles.cuentasToggle}>
				{usuarioActual === 'Demo' ? (
					<button
						className={`${styles.cuentasToggleRegister} ${esUsuarioNuevo ? 'active' : ''}`}
						onClick={() => setInicioDeSesionSeleccionado(false)}>
						Registrarse
					</button>
				) : (
					<button className={styles.CuentasToggleLogout} onClick={handleLogout}>
						Cerrar sesión
					</button>
				)}
				<button
					className={`${styles.cuentasToggleLogin} ${!esUsuarioNuevo ? 'active' : ''}`}
					onClick={() => setInicioDeSesionSeleccionado(true)}>
					Iniciar sesión
				</button>
			</div>
			<div className={styles.cuentasFormContainer}>
				<FormularioCuentas esUsuarioNuevo={esUsuarioNuevo} inicioDeSesionSeleccionado={inicioDeSesionSeleccionado} />
			</div>
		</>
	);
};
