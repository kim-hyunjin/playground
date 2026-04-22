import styles from './Button.module.css';

export default function Button2(props) {
  return (
    <button type={props.type} className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
