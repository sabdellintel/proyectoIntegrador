import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';
import { Header, Aside, Footer, Spinner } from '../components';
import {
	Home,
	Transferencias,
	Pagos,
	SolicitarPrestamo,
	SimularPrestamo,
	Conversor,
	Cuentas,
	Terminos,
	Privacidad
} from '../pages';

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [menuMobileOpen, setMenuMobileOpen] = useState(false);
	useEffect(() => {
		window.addEventListener('load', () => {
			setIsLoading(false);
		});
	}, []);
	return (
		<Router>
			{isLoading && <Spinner />}
			<UserProvider>
				<Header menuMobileOpen={menuMobileOpen} setMenuMobileOpen={setMenuMobileOpen} />
				<Aside setMenuMobileOpen={setMenuMobileOpen} />
				<main className="main-content" id="main-content">
					<Routes>
						<Route path="*" element={<Home />} />
						<Route path="/transferencias" element={<Transferencias />} />
						<Route path="/pagos" element={<Pagos />} />
						<Route path="/solicitar-prestamo" element={<SolicitarPrestamo />} />
						<Route path="/simular-prestamo" element={<SimularPrestamo />} />
						<Route path="/conversor" element={<Conversor />} />
						<Route path="/cuentas" element={<Cuentas />} />
						<Route path="/terminos-y-condiciones" element={<Terminos />} />
						<Route path="/politica-de-privacidad" element={<Privacidad />} />
					</Routes>
				</main>
				<Footer />
			</UserProvider>
		</Router>
	);
}

export default App;
