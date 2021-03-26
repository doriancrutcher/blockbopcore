import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Tab, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import ReactAudioPlayer from "react-audio-player";

import {
  Buckets,
  PushPathResult,
  KeyInfo,
  PrivateKey,
  WithKeyInfoOptions,
} from "@textile/hub";

const ArtistPage = (props) => {
  const [artistName, changeArtist] = useState("");
  const [loading, changeLoading] = useState(false);
  const [artistIPFSKey, changeKey] = useState("");
  const [useridentity, changeIdentity] = useState("");
  const [buckets, changeBuckets] = useState("");
  const [bucketKey, changeBucketKey] = useState("");
  const [links, changeLinks] = useState([]);
  const [songs, changeSongs] = useState([
    {
      src: "",
    },
  ]);

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
    const retreiveArtist = async (artist) => {
      if (props.artist) {
        localStorage.set("artistName", props.artist);
        changeArtist(props.artist);
      } else if (localStorage.getItem("artistName", props.artist)) {
        changeArtist(localStorage.getItem("artistName"));
      } else {
        null;
      }
    };
    retreiveArtist();
  }, []);

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
    let sender = await window.contract.getUserName({
      nearName: window.accountId,
    });
    window.contract.transfer_listens({
      sender: sender,
      recipient: props.artist,
      listens: 1,
    });
  };

  const getIdentity = async (artistName) => {
    try {
      var storedIdent = await window.contract.get_ipfs_key({
        artistName: artistName,
      });
      console.log(artistName);
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
    <Container>
      <Row style={{ marginTop: "10px" }}>
        <Table striped bordered hover variant='dark'>
          <thead>
            <tr>
              <th colSpan='3'>
                {localStorage.getItem("artistName")
                  ? localStorage.getItem("artistName")
                  : `Artist's`}{" "}
                Music Library
              </th>
            </tr>
            <tr>
              <th>Track Name</th>
              <th>Player</th>
              {/* <th>Contributors</th> */}
            </tr>
          </thead>
          <tbody>
            {songs.map((x, index) => {
              return (
                <tr key={index}>
                  <td>{x.songName}</td>
                  <td className='ju'>
                    {" "}
                    <ReactAudioPlayer
                      src={x.src}
                      autoPlay={false}
                      onPlay={() => updateListensVal()}
                      controls
                    />
                  </td>
                  {/* <td>
                    <Container>
                      <Row className='d-flex justify-content-center'>
                        <Col className='d-flex justify-content-center'>
                          <Button onClick={() => addLike(x.songName)}>
                            Like
                          </Button>
                        </Col>
                        <Col className='d-flex justify-content-center'>
                          <Button
                            onClick={() => addDislike(x.songName)}
                            variant='danger'
                          >
                            Dislike
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </td> */}
                  <td>
                    <Container>
                      <Row className='d-flex justify-content-center'></Row>
                      <Row className='d-flex justify-content-center'></Row>
                    </Container>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

ArtistPage.propTypes = {};

export default ArtistPage;
