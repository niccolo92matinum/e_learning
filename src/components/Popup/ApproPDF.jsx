import React, { useState } from "react";
import { PDFReader } from "reactjs-pdf-reader";
import styles from "./Popup.module.scss";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useKeyPressCallback } from "../../utils/useKeyPressCallback";

const ApproPDF = (props) => {
  let [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const onDocumentComplete = () => {
    setIsLoadingPdf(false);
  };

  const KEYCODE_ESC = 27;
  useKeyPressCallback(KEYCODE_ESC, props.onClosePopup);

  // FIXME: In strict mode si ha il seguente errore: "Cannot use the same canvas during multiple render() operations. Use different canvas or ensure previous operations were cancelled or completed."

  return (
    props.pdfLink && (
      <div
        tabIndex={0}
        className={styles.Popup}
        onBlur={() => {
          /*props.onClosePopup()*/
        }}
      >
        <div className={styles.header}>
          <span>{props.title}</span>
          <FontAwesomeIcon
            icon={faTimes}
            size="lg"
            className={"clickable"}
            onClick={() => {
              props.onClosePopup();
            }}
          />
        </div>
        <div className={styles.content}>
          <PDFReader
            url={props.pdfLink}
            showAllPage={true}
            onDocumentComplete={() => onDocumentComplete()}
          />
          {isLoadingPdf && (
            <div className={styles.loading}>
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ApproPDF;
