"use strict";

const NODE = require('./ipfs')
const node = new NODE()

const getPeers = require('./peers')
const INTERVAL = 20000 // Recconnet to peers interval


const config = {
    Addresses: {
        Gateway: "/ip4/165.227.82.120/tcp/8080"
    }
}


const initGateway = async () => {
    try {
        const peers = await getPeers()

        await node.startNode(null,config)

        if (peers && peers.length > 0) {
            await stayConnected(peers)
        }

    } catch (error) {
        throw error
    }

}
const stayConnected = async (peers) => {

    await node.connectToPeers(peers)

    setTimeout(async () => {
        await node.connectToPeers(peers)

    }, INTERVAL);
}

initGateway()