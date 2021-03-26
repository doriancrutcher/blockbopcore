import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { async } from "regenerator-runtime";

const TipTool = (props) => {
  const tipRef = useRef();
  const [sendMonies, changeMonies] = useState(false);

  const sendTip = async (recipient, amount) => {
    let formatToYoctoNEAR = window.utils.format.parseNearAmount(amount);
    let getNearName = await window.contract.getNearName({
      displayName: recipient,
    });
    await window.account.sendMoney(getNearName, formatToYoctoNEAR);
    alert(`${recipient} thank you for sending the tip!`);
    changeMonies(true);
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Send Tip to {props.recipient}</Card.Title>
        <Card.Text>Support this artist by sending a tip!</Card.Text>
        <Container>
          <Row>
            <Col>
              <input ref={tipRef} placeholder='enter value in NEAR'></input>
            </Col>
            <Col>
              <Button
                disabled={sendMonies}
                onClick={() => sendTip(props.recipient, tipRef.current.value)}
              >
                Send Tip
              </Button>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

TipTool.propTypes = {};

export default TipTool;
