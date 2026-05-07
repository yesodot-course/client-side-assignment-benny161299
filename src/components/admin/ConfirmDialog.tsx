import { useTranslation } from 'react-i18next';
import styles from './ConfirmDialog.module.css';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.confirmBox}>
        <p className={styles.confirmMsg}>{message}</p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button className={styles.dangerBtn} onClick={onConfirm}>
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
