import styles from './DeleteModal.module.css';
import PropTypes from 'prop-types';

export default function DeleteModal({
  handleDeleteConfirm,
  setShowDeleteModal,
}) {
  return (
    <div className={styles.backGround}>
      <div className={styles.quizContainer}>
        <div className={styles.title}>Are you sure you want to delete?</div>
        <div className={styles.btnContainer}>
          <div
            className={styles.btn}
            style={{ background: '#FF4B4B', color: '#fff' }}
            onClick={() => handleDeleteConfirm()}
          >
            Confirm
          </div>
          <div className={styles.btn} onClick={() => setShowDeleteModal(false)}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteModal.propTypes = {
  handleDeleteConfirm: PropTypes.func.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
};
