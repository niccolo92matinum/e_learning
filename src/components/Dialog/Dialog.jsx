import React, {forwardRef} from 'react';
import styles from './Dialog.module.scss';
import {Button} from "../Button/Button.jsx";

const Dialog = forwardRef(function({ yesTranslate, descriptionText, onConfirmModal }, ref) {
    return (
        <dialog ref={ref} className={styles.Modal}>
            <p>{descriptionText}</p>
            <div>
                <Button onClick={onConfirmModal}>{yesTranslate}</Button>
            </div>
        </dialog>
    );
});

export default Dialog;
