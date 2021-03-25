import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { async } from "regenerator-runtime";

const TipTool = (props) => {
  const tipRef = useRef();
  const sendTip = async (recipient, amount) => {
    let formatToYoctoNEAR = window.utils.format.parseNearAmount(amount);
    await window.account.sendMoney(recipient, formatToYoctoNEAR);
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
