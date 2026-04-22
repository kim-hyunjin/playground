import styles from './Banner.module.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Banner = (props: { videoId: string; title: string; imgUrl: string }) => {
  const { videoId, title, imgUrl } = props;

  const router = useRouter();

  const handleOnPlay = () => {
    router.push(`video/${videoId}`);
  };

  // const replacedTitle = title.replaceAll('&amp;', '&').replaceAll('&#39;', `'`);
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          {/* <h3 className={styles.title}>{replacedTitle}</h3> */}

          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <Image
                src='/static/play_arrow.svg'
                alt='Play icon'
                width='32'
                height='32'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl}`,
        }}
      ></div>
    </div>
  );
};

export default Banner;
