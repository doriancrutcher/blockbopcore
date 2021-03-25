import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TwitchEmbed } from "react-twitch-embed";
import { Container, Row, Col, Table } from "react-bootstrap";
import FeaturedArtist from "./FeaturedArtist";

const HomePage = (props) => {
  const [artistList, changeArtistList] = useState([]);

  useEffect(() => {
    const getArtistList = async () => {
      let list = await window.contract.get_user_name_list();

      changeArtistList(list);
    };
    getArtistList();
  }, []);

  return (
    <Container fluid>
      <Row
        style={{ marginTop: "10px", marginBottom: "30px" }}
        className='d-flex justify-content-center'
      >
        <Col className='d-flex justify-content-center'>
          <TwitchEmbed
            style={{ height: "100%", width: "60vw" }}
            channel='Insomniac'
            id='moonstar_x'
            theme='dark'
            muted
            onVideoPause={() => console.log(":(")}
          />
        </Col>
        <Col>
          <Row className='d-flex justify-content-center'>
            {" "}
            <FeaturedArtist />
          </Row>
        </Col>
      </Row>

      <Row className='justify-content-center d-flex'>
        <Table style={{ width: "75vw" }} striped bordered hover variant='dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {artistList.map((x, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{x}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

HomePage.propTypes = {};

export default HomePage;
