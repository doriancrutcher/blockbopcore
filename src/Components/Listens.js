import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Container, Card, Row, Button } from "react-bootstrap";

const Listens = (props) => {
  const [buttonStatus, changeButtonStatus] = useState(false);
  const nearPurchase = useRef();
  const buyListens = async (getListens) => {
    let getUserName = await window.contract.getUserName({
      nearName: window.accountId,
    });
    await window.account.sendMoney("blockbop.blockhead.testnet", getListens);
    let finalListensAmount = 10 * getListens;
    await window.contract.add_listens({
      displayName: getUserName,
      listens: finalListensAmount,
    });
    changeButtonStatus(true);
    alert("purchased confirmed");
  };

  return (
    <Container>
      <Row
        style={{ marginTop: "30px" }}
        className='d-flex justify-content-center'
      >
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Buy Listens</Card.Title>

            <Card.Text>1 Near = 10 Listens</Card.Text>
            <Container>
              <Row className='d-flex justify-content-center'>
                <input ref={nearPurchase} placeholder='enter amount'></input>
              </Row>
              <Row
                style={{ marginTop: "15px" }}
                className='d-flex justify-content-center'
              >
                <Button
                  disabled={buttonStatus}
                  onClick={() => buyListens(nearPurchase.current.value)}
                >
                  Confirm Purchase
                </Button>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

Listens.propTypes = {};

export default Listens;
