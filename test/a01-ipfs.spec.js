const chai = require('chai')
const assert = chai.assert
const fs = require('fs')
const afs = fs.promises

const IPFS_FOLDER_NAME = 'testNode'
const IPFS_FOLDER_NAME2 = 'testNode2'

const PATH_IPFS_NODE_TEST = `${__dirname}/../ipfs-data/${IPFS_FOLDER_NAME}`
const PATH_IPFS_NODE_TEST2 = `${__dirname}/../ipfs-data/${IPFS_FOLDER_NAME2}`

const IPFS = require('../ipfs')
const ipfs = new IPFS()

 const deleteFolderRecursive = async (path) => {

    if (fs.existsSync(path)) {
        for (const entry of await afs.readdir(path)) {
            const curPath = path + '/' + entry
            if ((await afs.lstat(curPath)).isDirectory()) {
                await deleteFolderRecursive(curPath)
            } else await afs.unlink(curPath)
        }
        await afs.rmdir(path)
    }
} 

describe('#ipfs.js', async () => {
    before(()=>{
    })        

    after(async () => {
        await deleteFolderRecursive(PATH_IPFS_NODE_TEST)
        await deleteFolderRecursive(PATH_IPFS_NODE_TEST2) 
    })
    describe('#startNode', async () => {
        
        it('should create ipfs node with repository and configuration include ', async () => {
            const repo = `./ipfs-data/${IPFS_FOLDER_NAME}`
            const config = {
                Addresses: {
                    Swarm: [
                        '/ip4/0.0.0.0/tcp/4006',
                        '/ip4/127.0.0.1/tcp/4007/ws'
                    ],
                    API: '/ip4/127.0.0.1/tcp/4008',
                    Gateway: '/ip4/127.0.0.1/tcp/4009'
                }
            }
            const resultNode = await ipfs.startNode(repo, config)
            const ipfsRepo =  await resultNode.repo.stat()
            const ipfsResultConfig =  await resultNode.config.get()

            //assert.exists(ipfsRepo.repoPath)
            assert.exists(ipfsResultConfig.Addresses.API)
            assert.exists(ipfsResultConfig.Addresses.Gateway)
            assert.exists(ipfsResultConfig.Addresses.Swarm[0])
            assert.exists(ipfsResultConfig.Addresses.Swarm[1])

            assert.equal(
                ipfsRepo.repoPath,
                repo
            )
            assert.equal(
                ipfsResultConfig.Addresses.API,
                config.Addresses.API
            )
            assert.equal(
                ipfsResultConfig.Addresses.Gateway,
                config.Addresses.Gateway
            )
            assert.equal(
                ipfsResultConfig.Addresses.Swarm[0],
                config.Addresses.Swarm[0]
            )
            assert.equal(
                ipfsResultConfig.Addresses.Swarm[1],
                config.Addresses.Swarm[1]
            )
        })

        it('should throw error in start ipfs node if repository is not string  ', async () => {
            try {
                const repo = 1
                const config = {
                    Addresses: {
                        Swarm: [
                            '/ip4/0.0.0.0/tcp/8006',
                            '/ip4/127.0.0.1/tcp/8007/ws'
                        ],
                        API: '/ip4/127.0.0.1/tcp/8008',
                        Gateway: '/ip4/127.0.0.1/tcp/8009'
                    }
                }
                const result = await ipfs.startNode(repo, config)

                assert.isUndefined(result)
            } catch (err) {
                assert.include(err.message, 'ipfs repository\' must be a String!')
            }
        })
        it('should throw error in start ipfs node if configuration is not object  ', async () => {
            try {
                const repo = `./ipfs-data/${IPFS_FOLDER_NAME}`
                const config = 'bad config'
                const result = await ipfs.startNode(repo, config)

                assert.isUndefined(result)
            } catch (err) {
                assert.include(err.message, 'ipfs configuration\' must be a Object')
            }
        })

        it('should throw error  if the repository are currently in use', async () => {
            try {
                // the default addresses are currently in use by the server
                const repo = `./ipfs-data/${IPFS_FOLDER_NAME}`
                const result = await ipfs.startNode(repo)

                assert.isUndefined(result)
            } catch (err) {
                assert.include(err.message, '\'ipfs repository\' are already exists!')
            }
        })
    })
    describe('#connectToPeers', async () => {

        it('should throw error  if peers array is not include', async () => {
            try {

                await ipfs.connectToPeers()

                assert(false, 'Unexpected result')
            } catch (err) {
                assert.include(err.message, 'peers must be array!')
            }
        })
        it('should throw error  if peers array is empty', async () => {
            try {
                const peers = []
                await ipfs.connectToPeers(peers)

                assert(false, 'Unexpected result')
            } catch (err) {
                assert.include(err.message, 'peers array is empty!')
            }
        })

    })
})