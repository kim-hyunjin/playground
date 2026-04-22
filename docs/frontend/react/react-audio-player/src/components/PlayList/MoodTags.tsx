import Tag from 'components/UI/Tag';

import styles from './MoodTags.module.scss';

export default function MoodTags({ moods }: { moods: string[] }) {
  return (
    <div className={styles.moodTags}>
      {moods.map((mood) => (
        <Tag key={mood} name={mood} />
      ))}
    </div>
  );
}
