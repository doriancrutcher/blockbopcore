import "regenerator-runtime/runtime";
import React, { useEffect, useState, useReducer, useRef } from "react";
import { login, logout } from "./utils";
import "./global.css";
import "./sass/App.scss";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Form,
  FormControl,
  Card,
  Jumbotron,
  NavItem,
} from "react-bootstrap";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import SignUpPage from "./Components/SignUpPage";
import HomePage from "./Components/HomePage";
import ArtistTools from "./Components/ArtistTools";
import DragAndDropContainer from "./Components/DragAndDrop/DragAndDropContainer";
import Add_Music_Tool from "./Components/Add_Music_Tool";
import ArtistPage from "./Components/ArtistPage";

import getConfig from "./config";
import { async } from "regenerator-runtime/runtime";
import Listens from "./Components/Listens";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

let pexelAPIKey = "563492ad6f91700001000001f0893039a5fc4500a009df24bc014cba";

var pageBG = {
  backgroundImage: `url(curl -H "Authorization: 563492ad6f91700001000001f0893039a5fc4500a009df24bc014cba" \
  "https://api.pexels.com/v1/curated?per_page=1"
)`,
};
export default function App() {
  const [checkLoginStatus, changeLoginStatus] = useState(true);
  const [backgroundImagePexel, changePexel] = useState("black");
  const [redirect, changeRedirect] = useState(false);
  const [artistQuereyName, changeArtistQuereyName] = useState("");
  const [listenAmt, changeListenAmt] = useState(0);
  const [loading, changeLoading] = useState(false);

  const artistSearchRef = useRef();

  // const reducer = (state, action) => {
  //   switch (action.type) {
  //     case "increment":
  //       return { count: state.count - 1 };
  //     case "decrement":
  //       return { count: state.count - 1 };
  //   }
  //   return { count: state.count + 1 };
  // };

  // const [state, dispatch] = useReducer(reducer, { count: 0 });

  // const increment = () => {
  //   dispatch({ type: "increment" });
  // };

  useEffect(() => {
    const getBackGround = async () => {
      fetch(
        `
      https://api.pexels.com/v1/search?query=musician&per_page=5`,
        {
          headers: {
            Authorization: pexelAPIKey,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          console.log(result);
          let x = result;
          let randomIndex = Math.floor(Math.random() * 5);
          changePexel(x.photos[randomIndex].src.large);
        });
    };
    getBackGround();
  }, []);

  useEffect(() => {
    const checkDisplayNameStatus = async () => {
      let dispName = await window.contract.getUserName({
        nearName: window.accountId,
      });
      if (dispName === "no name retrieved") {
        return null;
      } else {
        changeLoginStatus(false);
      }
    };
    checkDisplayNameStatus();
  }, []);

  useEffect(() => {
    const updateMyListens = async () => {
      const displayNameVal = await window.contract.getUserName({
        nearName: window.accountId,
      });
      const currListens = await window.contract.get_listens({
        displayName: displayNameVal,
      });

      changeListenAmt(currListens);
    };

    updateMyListens();
  });

  const findArtist = async () => {
    console.log(artistSearchRef.current.value);
    localStorage.setItem("artistName", artistSearchRef.current.value);
    const artistQuerey = artistSearchRef.current.value;
    const nearNameResult = await window.contract.getNearName({
      displayName: artistQuerey,
    });
    console.log(nearNameResult);
    if (nearNameResult !== "no name found") {
      console.log("launch!");
      changeRedirect(true);
    }
  };

  const well = () => {
    console.log("code");
    if (redirect === true) {
      console.log("true");
      return <Redirect to='Artist' />;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImagePexel})`,
        backgroundSize: "cover",
        // backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <Router>
        {well()}
        <Navbar
          bg='dark'
          variant='dark'
          style={{ color: "white", width: "100%" }}
        >
          <Navbar.Brand href='/'>BlockBop</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse aria-controls='basic-navbar-nav' />
          <Nav className='mr-auto'>
            <Nav.Link>
              <Link to='/'>Home</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to='/MyMusic'>My Bops</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to='/Listens'>{listenAmt} :Listens</Link>
            </Nav.Link>
          </Nav>
          <Form inline>
            <FormControl
              ref={artistSearchRef}
              type='text'
              placeholder='Search'
              className='mr-sm-2'
            />
            <Button onClick={findArtist} variant='outline-info'>
              Search
            </Button>
          </Form>
          <Nav.Link
            style={{ color: "white" }}
            onClick={window.accountId === "" ? login : logout}
            eventKey={2}
          >
            {window.accountId === "" ? "Login" : window.accountId}
          </Nav.Link>
        </Navbar>
        {window.accountId !== "" ? (
          <Container fluid>
            <Row className='d-flex justified-content-center'>
              {checkLoginStatus ? (
                <SignUpPage></SignUpPage>
              ) : (
                <Switch>
                  <Route exact path='/'>
                    {" "}
                    <HomePage></HomePage>
                  </Route>
                  <Route exact path='/MyMusic'>
                    <Add_Music_Tool />
                  </Route>
                  <Route exact path='/Artist'>
                    <ArtistPage artist={artistQuereyName} />
                  </Route>
                  <Route exact path='/Listens'>
                    <Listens />
                  </Route>
                </Switch>
              )}
            </Row>
            <Row></Row>
          </Container>
        ) : (
          <Container
            fluid
            style={{
              height: "100vh",
              backgroundImage: `url(${backgroundImagePexel})`,
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              backgroundPosition: "center",
              overflow: "none",
            }}
          >
            <Row className={"d-flex justify-content-center"}>
              <Jumbotron style={{ marginTop: "10px" }}>
                <h1 style={{ color: "black" }}>Well Hey There... </h1>
                <p>Go ahead and Login</p>
                <p>
                  <Button onClick={login}>Login</Button>
                </p>
              </Jumbotron>
            </Row>
          </Container>
        )}
      </Router>
    </div>
  );
}
