import styles from "./ConfirmModal.module.scss";

const ConfirmModal = (props) => {
  const { onNoClick, yesTranslate, noTranslate, descriptionText } = props;
  return (
    <div className={styles.overflowModal}>
      <div className={styles.containerModal}>
        <p>{descriptionText}</p>
        <div>
          <button onClick={props.onConfirmModal}>{yesTranslate}</button>
          <button onClick={onNoClick}>{noTranslate}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
