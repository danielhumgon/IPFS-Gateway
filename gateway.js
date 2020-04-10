"use strict";

const NODE = require('./ipfs')
const node = new NODE()

const getPeers = require('./peers')
const INTERVAL = 20000 // Recconnet to peers interval




const initGateway = async () => {
    try {
        const peers = await getPeers()

        await node.startNode()

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