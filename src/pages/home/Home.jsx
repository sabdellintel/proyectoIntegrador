import { useUserContext } from '../../hooks/useUserContext';
import styles from './home.module.css';

export const Home = () => {
	const { usuarios, usuarioActual } = useUserContext();
	return (
		<section className={styles.userDashboard}>
			<div className={styles.userDashboardHello}>
				<span>Bienvenido de vuelta {usuarioActual}</span>
			</div>
			<div className={styles.userDashboardHeader}>
				<h1>Banking, tu home banking con todo en un solo lugar</h1>
			</div>
			<div className={styles.userDashboardSection}>
				<h2>Saldo Actual</h2>
				<p className={styles.userBalance} id="user-balance">
					${usuarios[usuarioActual.toLowerCase()].saldo}
				</p>
			</div>
			<div className={styles.userDashboardSection}>
				<h2>Historial de Transferencias</h2>
				<ul id="transfer-history">
					{usuarios[usuarioActual.toLowerCase()].historialTransferencias.map(
						({ esIngreso, emisor, receptor, monto, id }) => (
							<li key={id} className={`${styles.transfer} ${esIngreso ? 'ingreso' : 'egreso'}`}>
								<span>
									{esIngreso ? 'Emisor' : 'Receptor'}: {esIngreso ? emisor : receptor}
								</span>
								<span className={styles.amount}>${monto}</span>
							</li>
						)
					)}
				</ul>
			</div>
			<div className={styles.userDashboardSection}>
				<h2>Pagos Realizados</h2>
				<ul id="payment-history">
					{usuarios[usuarioActual.toLowerCase()].historialPagos.map(({ numero, monto, id }) => (
						<li key={id} className={styles.payment}>
							<span>N° {numero}</span>
							<span className={styles.amount}>${monto}</span>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.userDashboardSection}>
				<h2>Préstamos Solicitados</h2>
				<ul id="loan-history">
					{usuarios[usuarioActual.toLowerCase()].historialPrestamos.map(({ tipo, tasaInteres, plazo, monto, id }) => (
						<li key={id} className={styles.loan}>
							<span>
								{tipo} - {tasaInteres}% - {plazo} meses
							</span>
							<span className={styles.amount}>${monto}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};
