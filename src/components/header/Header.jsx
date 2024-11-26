import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';
import PropTypes from 'prop-types';
import styles from './header.module.css';

export const Header = ({ menuMobileOpen, setMenuMobileOpen }) => {
	// Consumir el valor del contexto
	const { usuarioActual } = useUserContext();
	useEffect(() => {
		// Selecciona el botón del menú móvil y el panel lateral
		const asideEl = document.querySelector('#aside');
		asideEl.classList.toggle('visible'); // Alterna la visibilidad del panel lateral
	}, [menuMobileOpen]);

	return (
		<header className={styles.header}>
			<Link to="/" aria-label="Volver al inicio">
				<img src="/imagenes/banking-logo.png" alt="Banking Logo" />
			</Link>
			<div className={styles.navigation}>
				<div className={styles.searchBar}>
					<input type="text" placeholder="Buscar" aria-label="Buscar" />
					<button className={styles.searchButton} aria-label="Buscar">
						<span className="material-symbols-outlined">search</span>
					</button>
				</div>
				<div className={styles.headerIcons}>
					<button aria-label="Notificaciones">
						<div className="material-symbols-outlined">notifications</div>
					</button>
					<Link to={'/cuentas'} aria-label="Perfil de usuario" className={styles.userProfile}>
						<div className={`material-symbols-outlined ${styles.userImage}`}>account_circle</div>
						<div className={styles.userOptions}>
							<span>{usuarioActual ?? 'Usuario Nuevo'}</span>
							<div className={`material-symbols-outlined ${styles.expand}`}>expand_more</div>
						</div>
					</Link>
				</div>
				<div className={styles.navMobile}>
					<button
						onClick={() => setMenuMobileOpen(() => !menuMobileOpen)}
						className={`${styles.navMobileButton} ${menuMobileOpen ? ' open' : ''}`}>
						<span className={`material-symbols-outlined ${styles.openIcon}`}>menu</span>
						<span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
					</button>
				</div>
			</div>
		</header>
	);
};

Header.propTypes = {
	menuMobileOpen: PropTypes.bool,
	setMenuMobileOpen: PropTypes.func
};
