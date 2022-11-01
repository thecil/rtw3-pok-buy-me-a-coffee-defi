import React from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useContract } from "./useContract";
import { BigNumber } from "ethers";

interface dataInfo {
    from: string,
    name: string,
    message: string,
    timestamp: BigNumber
}

export const Memo: React.FC = () => {
  const { getMemos } = useContract();
  console.log("getMemos", getMemos);
  const [loading, setLoading] = useState(false);

  //   if (getMemos?.length <= 0) {
  //     return (
  //       <Row className="flex justify-center">
  //         <Col md={6} className="grid space-y-2">No memos</Col>
  //       </Row>
  //     );
  //   }

  return (
    <Row className="flex justify-center">
      <Col md={6} className="grid space-y-2">
        {getMemos.map( (item: any, i: any) => {
            <React.Fragment key={i}>

            </React.Fragment>
        })}
      </Col>
    </Row>
  );
};
