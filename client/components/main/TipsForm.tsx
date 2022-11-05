import { toast } from "react-toastify";
import React, { useState } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { useContract } from "./useContract";
import Link from "next/link";
import { Modal } from "../modal/Modal";

export interface TipsFormProps {
  // eslint-disable-next-line no-unused-vars
  onTipSuccess: (transactionUrl: string) => void;
}

export const TipsForm: React.FC<TipsFormProps> = ({ onTipSuccess }) => {
  const {
    buyCoffee,
    senderName,
    senderMessage,
    tipAmount,
    setSenderName,
    setSenderMessage,
    setTipAmount,
    fetchMemos,
  } = useContract();

  const [tipingInProgress, setTipingInProgress] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onTipClicked = async (e: any) => {
    e.preventDefault();
    setTipingInProgress(true);
    if (!buyCoffee.writeAsync) {
      toast.error("Tiping not ready");
      setTipingInProgress(false);
      return;
    }

    try {
      const pending = buyCoffee.writeAsync();
      toast.promise(pending, {
        pending: "Sending tip transaction",
        success: "Tip transaction sent!",
        error: "Error sending tip transaction",
      });

      let status;
      let hash: string;

      const confirmation = (await pending).wait(2);
      toast.promise(confirmation, {
        pending: "Waiting for 2 confirmations",
        success: "Confirmed!",
        // eslint-disable-next-line key-spacing
        error: "Tip transaction error",
      });
      setShowModal(true);
      const trans = await confirmation;
      console.log("confirmed trans:", { trans });
      status = trans.status;
      hash = trans.transactionHash;

      if (status && typeof onTipSuccess === "function") {
        const url = `https://goerli.etherscan.io/tx/${hash}`;
        onTipSuccess(url);
        fetchMemos();
      } else {
        toast.error("Tip transaction failed");
      }
    } catch (error) {
      console.log("TipsForm::", { error });
      toast.error("Error while tipping");
    }
    setTipingInProgress(false);
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <Modal
          text={"Transaction Modal"}
          close={() => setShowModal(false)}
          className="bg-neutral-800"
          bg={"black"}
        >
          <div className="w-max m-2 mx-auto">
            <h2 className="text-center text-white">Processing your tip!</h2>
            <p className="text-center text-white">Please wait...</p>
          </div>
          <div className="w-max h-max overflow-hidden mx-auto">
            <video autoPlay loop muted className="w-96 h-96 rounded">
              <source src="/video/au_video.mp4" />
            </video>
          </div>
        </Modal>
      )}
      <Form onSubmit={onTipClicked}>
        <div className="mb-4">
          <h1 className="text-xl">Buy thecil a Coffee!</h1>
        </div>
        <Row className="pt-3">
          <Col>
            <div className="flex flex-col space-y-4 justify-center">
              <fieldset disabled={tipingInProgress}>
                <InputGroup className="space-x-2">
                  <Form.Text className="text-white text-lg">Name:</Form.Text>
                  <Form.Control
                    className="rounded pl-2"
                    name="senderName"
                    type="text"
                    value={senderName}
                    onChange={({ target }) => setSenderName(target.value)}
                    placeholder="anon"
                    aria-label="tipper-name"
                    aria-labelledby="lbl-name"
                  />
                </InputGroup>

                <InputGroup className="space-x-2">
                  <Form.Text className="text-white text-lg">Message:</Form.Text>
                  <Form.Control
                    className="rounded pl-2"
                    name="message"
                    type="text"
                    value={senderMessage}
                    onChange={({ target }) => setSenderMessage(target.value)}
                    placeholder="Enjoy your coffee!"
                    aria-label="tipper-message"
                    aria-labelledby="lbl-message"
                  />
                </InputGroup>

                <InputGroup className="space-x-2">
                  <Form.Text className="text-white text-lg">
                    Amount (in ETH):
                  </Form.Text>
                  <Form.Control
                    className="rounded pl-2"
                    name="message"
                    type="text"
                    value={tipAmount}
                    onChange={({ target }) => setTipAmount(target.value)}
                    placeholder="0.001"
                    aria-label="tipper-amount"
                    aria-labelledby="lbl-amount"
                  />
                </InputGroup>
              </fieldset>

              <ButtonPrimary
                type="submit"
                text={tipingInProgress ? "Processing..." : "Tip Me"}
                disabled={tipingInProgress ? true : false}
              />
            </div>
          </Col>
          <Col className="mt-3">
            <h3>Read more about this project:</h3>
            <Link href="https://docs.alchemy.com/docs/how-to-build-buy-me-a-coffee-defi-dapp#build-the-frontend-buy-me-a-coffee-website-dapp-with-replit-and-ethersjs">
              <a target="_blank" className="text-blue-400 text-sm">
                How to Build "Buy Me a Coffee" DeFi dapp
              </a>
            </Link>
          </Col>

          <Col className="">
            <Link href="">
              <a target="_blank" className="text-blue-400 text-sm">
                Goerli Verified Contract
              </a>
            </Link>
          </Col>

          <Col className="">
            <Link href="https://github.com/thecil/rtw3-pok-buy-me-a-coffee-defi">
              <a target="_blank" className="text-blue-400 text-sm">
                GitHub Repo
              </a>
            </Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
