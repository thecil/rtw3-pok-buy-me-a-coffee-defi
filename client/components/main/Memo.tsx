import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useContract } from "../main/useContract";
import { BigNumber } from "ethers";

const memoStages = {
  error: -1,
  loading: 0,
  memos: 1,
  noMemos: 2,
};

export const Memo: React.FC = () => {
  const [stage, setStage] = useState(memoStages.loading);
  const { getMemos, isRefetching } = useContract();

  useEffect(() => {
    if(isRefetching) {
      console.log(`Memo: setStage from ${stage} to loading`);
      setStage(memoStages.loading);
    }
    if (getMemos?.length > 0) {
      if (stage !== memoStages.memos) {
        console.log(`Memo: setStage from ${stage} to memos`);
        setStage(memoStages.memos);
      }
      return;
    } else {
      if (stage !== memoStages.noMemos) {
        console.log(`Memo: setStage from ${stage} to noMemos`);
        setStage(memoStages.noMemos);
      }
      return;
    }
  }, [getMemos, stage, isRefetching]);

  const toDate = (time: BigNumber) => {
    const _timestamp = time.toNumber() * 1000;
    const _date = new Date(_timestamp).toLocaleString()
    return _date;
  }

  const content = useMemo(() => {
    switch (stage) {
      case memoStages.loading:
        return <Spinner animation="border" />;
      case memoStages.error:
        <div>Error</div>;
        break;
      case memoStages.memos:
        return (
          <Row className="grid grid-cols-3 gap-2 justify-items-center">
            {getMemos.map((memoId) => {
              return (
                <Col key={memoId} className="border border-slate-700 rounded p-2 w-60">
                  <p>From: {memoId[2]}</p>
                  <p>Date: { toDate(memoId[1]) }</p>
                  <p>Message: {memoId[3]}</p>
                </Col>
              );
            })}
          </Row>
        );
      case memoStages.noMemos:
        return (
          <Row className="flex justify-center">
            <Col md={6} className="grid space-y-2">
              No memos
            </Col>
          </Row>
        );
    }
  }, [stage]);

  return <>
  <div>
    <h3 className="text-xl font-semibold text-center pb-4">Memos</h3>
    {content}
  </div>
  </>;
};
