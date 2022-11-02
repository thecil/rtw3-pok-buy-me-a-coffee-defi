import React from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import { BigNumber } from "ethers";

interface MemoProps {
  memosIds: [];
}

export const Memo: React.FC<MemoProps> = ({ memosIds }) => {
  const [loading, setLoading] = useState(false);
  console.log('memo', memosIds)
  return (
    <>
      {memosIds.length > 0 ? (
        <Row className="flex justify-center">
          {memosIds.map((memoId) => {
            return (
              <Col key={memoId} md={4} className="grid space-y-2">
                {memoId[0] }
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row className="flex justify-center">
          <Col md={6} className="grid space-y-2">
            No memos
          </Col>
        </Row>
      )}
    </>
  );
};
