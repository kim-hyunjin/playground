import styles from './Tag.module.scss';

export default function Tag({ name, onClick }: { name: string; onClick?: (tag: string) => void }) {
  return (
    <div onClick={() => onClick?.(name)} className={styles.tag}>
      #{name}
    </div>
  );
}
