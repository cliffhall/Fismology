// Workaday imports
const { NFTStorage, Blob } = require('nft.storage');
const environments = require("../../environments");
const NFT_STORAGE_KEY = environments.apiKey.nft_storage;

/**
 * Deploy the given metadata to IPFS via NFT.Storage
 *
 * @param {Object} the metadata as a plain javascript object
 *
 * @return {String} the IPFS content id
 */
async function deployMetadata(metadata) {

    // Create NFTStorage client
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });

    // Create Blob for upload with Mime type
    const blob = new Blob([metadata], {type : 'application/json'});

    // Store the blob and report the content id
    const cid = await client.storeBlob(blob);

    return cid;
}

exports.deployMetadata = deployMetadata;