import React, { useEffect, useState } from "react";

import {
  Buckets,
  PushPathResult,
  KeyInfo,
  PrivateKey,
  WithKeyInfoOptions,
} from "@textile/hub";

const [useridentity, changeIdentity] = useState("");
const [buckets, changeBuckets] = useState("");
const [bucketKey, changeBucketKey] = useState("");
const [links, changeLinks] = useState([]);
const [songs, changeSongs] = useState([
  {
    src: "",
  },
]);

// Setup Functions

// User Information Functions
const getIdentity = async (artistName) => {
  try {
    var storedIdent = window.contract.get_ipfs_key({ nearName: artistName });

    if (storedIdent === "no Key Retrived") {
      throw new Error("No identity");
    }
    const restored = PrivateKey.fromString(storedIdent);
    return restored;
  } catch (e) {
    return e.message;
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

export default {
  getIdentity,
  getBucketKey,
  getBucketLinks,
  libraryFromIndex,
  getSongIndex,
};
