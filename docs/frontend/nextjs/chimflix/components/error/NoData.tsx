import styles from './NoData.module.css';

const NoData = ({ message = '검색 결과가 없습니다.' }: { message?: string }) => {
  return (
    <div className={styles.container}>
      <p>{message}</p>
    </div>
  );
};

export default NoData;
