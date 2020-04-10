/*
  This file contains a list of IPFS peers for the local node to maintain
  a connection with.
*/

"use strict";

const dns = require("dns");

const domain = ""

// Flag to indicate if I'm running within a home network or not.
const LOCAL = true;

async function getPeerArray() {
  try {
    let peerArray;

    if (LOCAL) {
      peerArray = [

      ];

      return peerArray;
    } else {
      return new Promise((resolve, reject) => {
        let ip;

        dns.lookup(domain, function (err, result) {
          if (err) return reject(err);

          ip = result;

          peerArray = [

          ];

          return resolve(peerArray);
        });
      });
    }
  } catch (err) {
    console.error(`Error in getPeerArray(): `, err);
  }
}

module.exports = getPeerArray;