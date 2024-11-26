import PropTypes from 'prop-types';

export const Exito = ({ message }) => {
	return <p className="exito">{message}</p>;
};

Exito.propTypes = {
	message: PropTypes.string
};
