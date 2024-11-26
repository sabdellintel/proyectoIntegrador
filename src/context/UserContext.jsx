import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes
import usuarioDemo from '../utils/usuarioDemo.json';

// Crear el contexto
export const UserContext = createContext();

// Hook para obtener el usuario actual
const useUsuarioActual = () => {
	const usuarioActual = localStorage.getItem('usuarioActual');
	if (!usuarioActual) {
		localStorage.setItem('usuarioActual', 'Demo');
		return 'Demo';
	}
	return usuarioActual;
};

// Hook para obtener la lista de usuarios
const useUsuarios = () => {
	let usuarios = localStorage.getItem('usuarios');
	if (!usuarios) {
		usuarios = {
			demo: usuarioDemo
		};
		localStorage.setItem('usuarios', JSON.stringify(usuarios));
		return usuarios;
	}
	return JSON.parse(usuarios);
};

// Proveedor de contexto
export const UserProvider = ({ children }) => {
	// Inicializar el estado directamente con los valores retornados por los hooks
	const [usuarioActual, setUsuarioActual] = useState(useUsuarioActual());
	const [usuarios, setUsuarios] = useState(useUsuarios());

	const updateUsuarios = (usuariosActualizado) => {
		if (!usuariosActualizado) return;
		setUsuarios(usuariosActualizado);
		localStorage.setItem('usuarios', JSON.stringify(usuariosActualizado));
	};
	return (
		<UserContext.Provider
			value={{
				usuarioActual,
				usuarios,
				setUsuarioActual,
				setUsuarios,
				updateUsuarios
			}}>
			{children}
		</UserContext.Provider>
	);
};

// Añadir PropTypes para validar las props
UserProvider.propTypes = {
	children: PropTypes.node.isRequired
};
