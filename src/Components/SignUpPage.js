import React, { useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const SignUpPage = (props) => {
  const displayNameRef = useRef();
  const twitchRef = useRef();
  const [sentInfo, changeSentInfo] = useState(false);

  const submitInfo = async () => {
    changeSentInfo(true);
    if (displayNameRef.current.value === "") {
      return alert("please enter a display name");
    } else {
      console.log(`setting display name to ${displayNameRef.current.value}`);
      await window.contract.setNewUserName({
        displayName: displayNameRef.current.value,
      });
      await window.contract.add_user_name_to_registry({
        userName: displayNameRef.current.value,
      });

      await window.contract.setNearName({
        displayName: displayNameRef.current.value,
      });

      await window.contract.add_listens({
        displayName: displayNameRef.current.value,
        listens: 100,
      });
      alert(`you've received 100 listens! Use them wisely!`);
      console.log("username added");
    }

    if (twitchRef.current.value !== "") {
      console.log(`setting twitch handle name to ${twitchRef.current.value}`);
      await window.contract.setTwitchName({
        twitchName: twitchRef.current.value,
      });
    }
    location.reload();
  };
  return (
    <Container>
      <Row className='d-flex justify-content-center' style={{ margin: "10px" }}>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Enter In Your Info</Card.Title>

            <Container>
              <Row
                className='d-flex justify-content-center'
                style={{ marginTop: "10%" }}
              >
                <input
                  ref={displayNameRef}
                  placeholder='enter display name'
                  type='text'
                ></input>
              </Row>
              <Row
                className='d-flex justify-content-center'
                style={{ marginTop: "10%" }}
              >
                <input
                  ref={twitchRef}
                  placeholder='enter twitch handle'
                  type='text'
                ></input>
              </Row>
              <Row
                style={{ marginTop: "10px" }}
                className='d-flex justify-content-center'
              >
                <Button disabled={sentInfo} onClick={submitInfo}>
                  Submit
                </Button>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

SignUpPage.propTypes = {};

export default SignUpPage;
