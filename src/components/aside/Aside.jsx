import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './aside.module.css';

export const Aside = ({ setMenuMobileOpen }) => {
	let { pathname } = useLocation();

	// Luego usa useNavigate en lugar de useHistory
	const navigate = useNavigate();
	const handleBack = () => {
		setMenuMobileOpen(false);
		navigate(-1); // Navega hacia atrás
	};

	return (
		<aside className={styles.aside} id="aside">
			<ul>
				{pathname === '/cuentas' ? (
					<button
						onClick={() => {
							handleBack();
							setMenuMobileOpen(false);
						}}
						className={styles.registerButton}
						id="account-action">
						<span className="plus-sign">⬅</span> Volver
					</button>
				) : (
					<Link
						to="/cuentas"
						className={styles.registerButton}
						id="account-action"
						onClick={() => setMenuMobileOpen(false)}>
						Ingreso
					</Link>
				)}
				<li>
					<Link onClick={() => setMenuMobileOpen(false)} to="/">
						<span className="material-symbols-outlined icon"> home</span> Inicio{' '}
					</Link>
				</li>
				<li>
					<Link onClick={() => setMenuMobileOpen(false)} to="/transferencias">
						<span className="material-symbols-outlined icon">account_balance</span> Transferencias
					</Link>
				</li>
				<li>
					<Link onClick={() => setMenuMobileOpen(false)} to="/pagos">
						<span className="material-symbols-outlined icon">order_approve </span>Pagos de Facturas
					</Link>
				</li>
				<li>
					<Link onClick={() => setMenuMobileOpen(false)} to="/solicitar-prestamo">
						<span className="material-symbols-outlined icon">paid</span> Solicitar Préstamo{' '}
					</Link>
				</li>
				<li>
					<Link onClick={() => setMenuMobileOpen(false)} to="/simular-prestamo">
						<span className="material-symbols-outlined icon">calculate</span> Simular Préstamo
					</Link>
				</li>
				<li>
					<Link onClick={() => setMenuMobileOpen(false)} to="/conversor">
						<span className="material-symbols-outlined icon">currency_exchange</span> Conversor{' '}
					</Link>
				</li>
			</ul>
		</aside>
	);
};

Aside.propTypes = {
	setMenuMobileOpen: PropTypes.func
};
