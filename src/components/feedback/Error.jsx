import PropTypes from 'prop-types'; // Importar PropTypes

export const Error = ({ message }) => {
	return <p className="error">{message}</p>;
};

Error.propTypes = {
	message: PropTypes.string
};
