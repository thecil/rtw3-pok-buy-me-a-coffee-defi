import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const closeIcon = <FontAwesomeIcon icon={faTimesCircle} />;

export interface ModalProps extends React.ComponentPropsWithRef<"button"> {
  text: string;
  bg?: string;
  close: () => void;
}

export const Modal: React.FC<ModalProps> = ({ close, bg, children }) => {
  const [_document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    setDocument(document);
  }, []);

  if (_document) {
    return ReactDOM.createPortal(
      <div className={styles.backdrop} onClick={close}>
        <div
          className={bg === "black" ? styles.blackModal : styles.modal}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.modalClose} onClick={close}>
            {closeIcon}
          </div>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </div>,
      _document.getElementById("modal") as HTMLElement
    );
  } else {
    return null;
  }
};

export default Modal;
