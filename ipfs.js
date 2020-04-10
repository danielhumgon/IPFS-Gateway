"use strict";


const fs = require('fs')
const IPFS = require('ipfs')
const Gateway = require('ipfs/src/http');


let ipfs
let gateway
let _this

class Node {

    constructor() {

        this.IPFS = IPFS
        this.fs = fs
        _this = this
    }

    async startNode(repository, configuration) {
        try {
            if (repository && typeof repository !== 'string') {
                throw new Error('\'ipfs repository\' must be a String!')
            }

            if (configuration && typeof configuration !== 'object') {
                throw new Error('\'ipfs configuration\' must be a Object!')
            }
            // for validate if it exits file  or directory
            if (repository && _this.fs.existsSync(repository)) {
                throw new Error('\'ipfs repository\' are already exists!')
            }

            const options = {
                repo: repository || './ipfs-data/node',
                start: true,
                EXPERIMENTAL: {
                    pubsub: true
                },
                config: configuration || {},
                // config: {
                //     Addresses: {
                //         Swarm: ["/ip4/0.0.0.0/tcp/8006", "/ip4/127.0.0.1/tcp/8007/ws"],
                //         API: "/ip4/127.0.0.1/tcp/8008",
                //         Gateway: "/ip4/127.0.0.1/tcp/8009"
                //     }
                // },
                relay: {
                    enabled: true, // enable circuit relay dialer and listener
                    hop: {
                        enabled: true // enable circuit relay HOP (make this node a relay)
                    }
                }
            }
            // starting ipfs node
            console.log('Starting IPFS...!')
            ipfs = await IPFS.create(options)
            console.log('... IPFS is ready.')

            // Starting Gateway
            gateway = new Gateway(ipfs);
            await gateway.start();
            console.log('... Gateway is ready.')

            return ipfs
        } catch (error) {
            console.error(`Error in startNode(): `, error);
            throw error
        }
    }

    async connectToPeers(peers) {
        try {
            // Validate Input
            if (!Array.isArray(peers)) throw new Error(`peers must be array!`);
            if (peers.length === 0) throw new Error(`peers array is empty!`);
            if (!ipfs) throw new Error(`ipfs node not started!`);

            // Connect to peers
            for (let i = 0; i < peers.length; i++) {
                console.log(`Conneting to peer ${peers[i]}`)
                await ipfs.swarm.connect(peers[i])
                console.log(`Conneted`)

            }

        } catch (error) {
            console.error(`Error in connetToPeers(): `, error);
            throw error
        }
    }
    async getPeers() {
        try {

            const nodePeers = await ipfs.swarm.peers()
            return nodePeers

        } catch (error) {
            console.error(`Error in getPeers(): `, error);
            throw error
        }
    }

}
module.exports = Node