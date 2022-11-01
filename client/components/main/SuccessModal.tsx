import React from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const closeIcon = <FontAwesomeIcon icon={faTimesCircle} />;

export interface SuccessModalProps
  extends React.ComponentPropsWithRef<typeof Modal> {
  transactionUrl: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  transactionUrl,
  ...props
}) => {
  const { onHide } = props || {};

  return (
    <Modal {...props} centered>
      <Modal.Body className="bg-neutral-900 p-4 relative rounded m-4 w-max mx-auto">
        <div className="flex justify-end">
          <span className="cursor-pointer	 text-white" onClick={() => onHide && onHide()}>
            {closeIcon}
          </span>
        </div>
        <div className="grid justify-items-center text-white p-4">
          <video autoPlay loop muted className="w-96 h-96 rounded">
            <source src="/video/au_video.mp4" />
          </video>

          <h1 className="text-2xl">TIP Success, Thank you!</h1>
          <p>WELCOME ALCHEMY CHALLENGES!</p>
          {transactionUrl && (
            <>
              <p>Etherscan transaction link:</p>
              <a
                href={transactionUrl}
                target="_blank"
                className="text-blue-400 truncate"
                rel="noreferrer"
              >
                {transactionUrl}
              </a>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
