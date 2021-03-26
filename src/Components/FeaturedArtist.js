import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Container, Col, Row, Table } from "react-bootstrap";
import Thumb from "../assets/Thumb.png";
import {
  Buckets,
  PushPathResult,
  KeyInfo,
  PrivateKey,
  WithKeyInfoOptions,
} from "@textile/hub";
import ReactAudioPlayer from "react-audio-player";
import TipTool from "./TipTool";

const FeaturedArtist = (props) => {
  const [thumbSize, changeThumbSize] = useState("5vw");
  const [artist, changeArtistDisplay] = useState("--");
  const [songs, changeSongs] = useState([]);
  const [artistName, changeArtist] = useState("");
  const [artistIPFSKey, changeKey] = useState("");
  const [useridentity, changeIdentity] = useState("");
  const [buckets, changeBuckets] = useState("");
  const [bucketKey, changeBucketKey] = useState("");
  const [links, changeLinks] = useState([]);
  const [loading, changeLoading] = useState(false);
  const [index, changeIndex] = useState({
    author: "",
    date: 0,
    paths: [],
    songNames: [],
  });

  //artistIPFS Key
  //aristsName

  const ipfsGateway = "https://hub.textile.io";
  const keyInfo = {
    key: "bfrfzbzvj6iatggdeak6d5ij36i",
    secret: "",
  };
  const keyInfoOptions = {
    debug: false,
  };

  useEffect(() => {
    const getArtistList = async () => {
      let list = await window.contract.get_user_name_list();
      let chosenArtist = list[Math.floor(list.length * Math.random())];
      console.log(chosenArtist);

      changeArtistDisplay(chosenArtist);
    };

    getArtistList();
  }, []);

  useEffect(() => {
    const retreiveArtist = async (artistName) => {
      if (artistName) {
        localStorage.setItem("artistName", artistName);
        changeArtist(artistName);
      } else if (localStorage.getItem("artistName", artistName)) {
        changeArtist(localStorage.getItem("artistName"));
      } else {
        null;
      }
    };
    retreiveArtist(artist);
  }, [artist]);

  useEffect(() => {
    const getInfo = async () => {
      // set identity
      const identity = await getIdentity(artistName);
      console.log(identity);
      changeIdentity(identity);
    };
    getInfo();
  }, [artistName]);

  useEffect(() => {
    const updateInfo = async () => {
      if (useridentity !== "") {
        //   // get user's music bucket
        const { bucketKey, buckets } = await getBucketKey(useridentity);
        changeBucketKey(bucketKey);
        changeBuckets(buckets);
      }
    };
    updateInfo();
  }, [useridentity]);

  useEffect(() => {
    const getLinks = async () => {
      if (buckets !== "" && bucketKey !== "") {
        await getBucketLinks();
        const index = await getSongIndex();
        if (index) {
          await libraryFromIndex(index);
          changeLoading(false);
          changeIndex(index);
        }
      }
    };
    getLinks();
  }, [bucketKey]);

  const updateListensVal = async () => {
    window.contract.window.contract.transfer_listens({
      sender: String,
      recipient: String,
      listens: i32,
    });
  };

  const getIdentity = async (artistName) => {
    try {
      var storedIdent = await window.contract.get_ipfs_key({
        artistName: artistName,
      });
      console.log(artistName);
      console.log(storedIdent);
      if (storedIdent === "no Key Retrived") {
        throw new Error("No identity");
      }
      const restored = PrivateKey.fromString(storedIdent);
      return restored;
    } catch (e) {
      return console.error("no key found for this idenity");
    }
  };

  const getBucketKey = async () => {
    if (!useridentity) {
      throw new Error("Identity not set");
    }
    const buckets = await Buckets.withKeyInfo(keyInfo, keyInfoOptions);
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(useridentity);

    const buck = await buckets.getOrCreate("io.textile.dropzone");

    if (!buck.root) {
      throw new Error("Failed to open bucket");
    }

    changeBuckets(buckets);
    changeBucketKey(buck.root.key);
    return { buckets: buckets, bucketKey: buck.root.key };
  };

  // Bucket Information
  const getBucketLinks = async () => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      return;
    }

    const links = await buckets.links(bucketKey);
    changeLinks({ ...links });
  };

  const libraryFromIndex = async (index) => {
    let songList = [];
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }

    console.log(index);

    for (let path of index.paths) {
      const metadata = await buckets.pullPath(bucketKey, path);
      const value = await metadata.next();

      let str = "";
      for (var i = 0; i < value.value.length; i++) {
        str += String.fromCharCode(parseInt(value.value[i]));
      }

      let info = JSON.parse(str);
      let song = info.original;
      songList.push({
        src: `${ipfsGateway}/ipfs/${song.cid}`,
        key: song.name,
        songName: info.name,
      });
    }

    console.log(songList);

    changeSongs(songList);
  };

  const getSongIndex = async () => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }
    try {
      const metadata = buckets.pullPath(bucketKey, "index.json");
      const { value } = await metadata.next();
      let str = "";
      for (var i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]));
      }
      const index = JSON.parse(str);
      return index;
    } catch (error) {
      const index = await initIndex();
      await initMusicLibrary();
      return index;
    }
  };

  return (
    <div>
      <Card style={{ width: "35vw" }}>
        {/* <Card.Img
          variant='top'
          src='https://lh3.googleusercontent.com/pw/ACtC-3fLFkEsGd_SZTTXhKtOOgE6ZdW6YOu4zTJNMct9O5Z_uW-fIVhigWRA9LIidXIUG1uA44tdCypUr7DuF1186rX_QRvGP8aIZ_FG1mnrkWXKHMEyJLt72yfGHxdLrfyZc7bdEK8VfTmfM660CVaAxP0X=w1562-h2082-no?authuser=0'
        /> */}
        <Card.Body>
          <Card.Title>{artist}</Card.Title>
          <Card.Text>
            {artist} is coming at you with the best beats of 2021
          </Card.Text>
          <Container className='d-flex justify-context-center'>
            <Row className='d-flex justify-context-center'>
              <Table striped bordered hover variant='dark'>
                <thead>
                  <tr>
                    <th>Song Name</th>
                    <th>Player</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((x, index) => {
                    let songName = x.songName;

                    if (songName.length > 25) {
                      songName =
                        songName.split("").splice(0, 25).join("") + "...";
                    }

                    return (
                      <tr>
                        <td>{songName}</td>
                        <td>
                          {" "}
                          <ReactAudioPlayer
                            src={x.src}
                            autoPlay={false}
                            controls
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      <TipTool recipient={artist} />
    </div>
  );
};

FeaturedArtist.propTypes = {};

export default FeaturedArtist;
