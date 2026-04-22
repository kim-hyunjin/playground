import styles from './banner.module.css';

interface Props {
  buttonText: string;
  onClick: () => void;
}

const Banner = (props: Props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shop!</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.onClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
