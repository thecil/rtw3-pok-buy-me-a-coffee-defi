import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import Layout from "../layout/Layout";
import MainContainer from "../container/MainContainer";
import { SuccessModal } from "./SuccessModal";
import { TipsForm } from "./TipsForm";
import Spinner from "react-bootstrap/Spinner";

const UiStages = {
  error: -1,
  loading: 0,
  connect: 1,
  tipping: 2,
};

const MainController: React.FC = () => {
  const [stage, setStage] = useState(UiStages.loading);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState("");
  const { isConnected } = useAccount();

  const onTipSuccess = (url: string) => {
    setShowSuccessModal(true);
    setTransactionUrl(url);
  };

  useEffect(() => {
    if (!isConnected) setStage(UiStages.connect);
    if (isConnected) {
      setStage(UiStages.tipping);
    }
  }, [isConnected]);

  const content = useMemo(() => {
    switch (stage) {
      case UiStages.loading:
        return <Spinner animation="border" variant="light" />;

      case UiStages.error:
        <div>Error</div>;
        break;

      case UiStages.connect:
        return <h1>Please Connect a Wallet first</h1>;

      case UiStages.tipping:
        return <TipsForm onTipSuccess={onTipSuccess} />;

      default:
        <div />;
    }
  }, [stage]);

  return (
    <Layout
      title="Alchemy - Buy me a Coffee"
      description="Alchemy - Buy me a Coffee"
    >
      <MainContainer>
        {content}
        <SuccessModal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          transactionUrl={transactionUrl}
        />
      </MainContainer>
    </Layout>
  );
};

export default MainController;
