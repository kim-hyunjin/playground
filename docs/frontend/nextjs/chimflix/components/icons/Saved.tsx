import { flushSync } from 'react-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

const Saved = ({ saved, onClick }: { saved: boolean; onClick: () => void }) => {
  const [startTrans, setStartTrans] = useState(false);

  const handleClick = () => {
    flushSync(() => setStartTrans(true));
    onClick();
    setStartTrans(false);
  };
  return (
    <button onClick={handleClick} style={{ width: '1.8rem' }}>
      {saved ? (
        <FontAwesomeIcon icon={faCheck} style={{ color: '#ffffff' }} />
      ) : (
        <motion.div animate={startTrans ? { rotate: 120 } : false}>
          <FontAwesomeIcon icon={faPlus} style={{ color: '#ffffff' }} />
        </motion.div>
      )}
    </button>
  );
};

export default Saved;
