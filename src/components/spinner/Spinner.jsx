import styles from './spinner.module.css';

export const Spinner = () => {
	return (
		<div
			onClick={(e) => {
				e.target.classList.add('spinner-hidden');
			}}
			className={styles.spinner}></div>
	);
};
