import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) throw new Error('UserContext fue usado fuera del UserContext.Provider');
	return context;
};
