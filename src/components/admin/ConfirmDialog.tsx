import styles from '../../pages/AdminPage.module.css';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}


export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.confirmBox}>
        <p className={styles.confirmMsg}>{message}</p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            ביטול
          </button>
          <button className={styles.dangerBtn} onClick={onConfirm}>
            🗑️ מחק
          </button>
        </div>
      </div>
    </div>
  );
}
