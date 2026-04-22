import cls from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

import styles from './card.module.css';

interface Props {
  name: string;
  imgUrl: string;
  href: string;
  className: string;
}

const Card = (props: Props) => {
  return (
    <Link href={props.href}>
      <a className={cls(styles.cardLink, props.className)}>
        <div className={cls(styles.container, 'glass')}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
              alt={props.name}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
