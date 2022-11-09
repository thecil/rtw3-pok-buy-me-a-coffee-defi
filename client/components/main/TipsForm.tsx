import { toast } from "react-toastify";
import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, InputGroup, Image } from "react-bootstrap";
import { useContract } from "./useContract";
import { Modal } from "../modal/Modal";
import { ethers } from "ethers";

export interface TipsFormProps {
  // eslint-disable-next-line no-unused-vars
  onTipSuccess: (transactionUrl: string) => void;
}

const uiStages = {
  processing: 0,
  normal: 1,
  large: 2,
};

export const TipsForm: React.FC<TipsFormProps> = ({ onTipSuccess }) => {
  const {
    buyCoffee,
    buyLargeCoffee,
    senderName,
    senderMessage,
    tipAmount,
    setSenderName,
    setSenderMessage,
    setTipAmount,
    fetchMemos,
  } = useContract();
  const [stage, setStage] = useState(uiStages.normal);
  const [tipingInProgress, setTipingInProgress] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (tipingInProgress) {
      setStage(uiStages.processing);
      return;
    }

    if (
      ethers.utils.parseEther(tipAmount) >= ethers.utils.parseEther("0.003")
    ) {
      setStage(uiStages.large);
      return;
    }
    if (ethers.utils.parseEther(tipAmount) < ethers.utils.parseEther("0.003")) {
      setStage(uiStages.normal);
      return;
    }
  }, [tipAmount, tipingInProgress]);

  const buttonsContent = useMemo(() => {
    switch (stage) {
      case uiStages.processing:
        return (
          <button
            disabled
            className={
              "cursor-pointer text-neutral-200 bg-neutral-500 rounded px-2 w-max self-center"
            }
          >
            Processing...
          </button>
        );
      case uiStages.normal:
        return (
          <button
            type="submit"
            className={
              "cursor-pointer text-neutral-200 bg-green-500 rounded px-2 w-max self-center hover:bg-green-800"
            }
          >
            <div className="flex space-x-1 items-center">
              <Image
                className="my-1 w-6"
                src="/icons/coffee-cup.svg"
                alt="join"
              />
              <p>Normal Coffee</p>
            </div>
          </button>
        );
      case uiStages.large:
        return (
          <button
            type="submit"
            className={
              "cursor-pointer text-neutral-200 bg-green-500 rounded px-2 w-max self-center hover:bg-green-800"
            }
          >
            <div className="flex space-x-1 items-center">
              <Image
                className="my-1 w-10"
                src="/icons/coffee-cup.svg"
                alt="join"
              />
              <p>Large Coffee</p>
            </div>
          </button>
        );
    }
  }, [stage]);

  const onTipClicked = async (e: any) => {
    e.preventDefault();
    setTipingInProgress(true);

    if (!buyCoffee.writeAsync || !buyLargeCoffee.writeAsync) {
      toast.error("Tiping not ready");
      setTipingInProgress(false);
      return;
    }

    try {
      const pending =
        ethers.utils.parseEther(tipAmount) >= ethers.utils.parseEther("0.003")
          ? buyLargeCoffee.writeAsync()
          : buyCoffee.writeAsync();

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
              {buttonsContent}
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
