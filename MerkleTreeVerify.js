const { MerkleTree } = require('merkletreejs')
const sha3 = require('crypto-js/sha3');

// API parameter for /getproof PUT endpoint
 const apiParam = {
                    "loanid": "loan3",
                    "leaf": {
                        "email": "Star@gmail.com"
                    }
                }

// API will return proof that looks like this

const proof = [
    {
        "position": "left",
        "data": "0x95e88cef628db121817527e1c825588d30f48dbea4c561ef5a18a2423087bcb6"
    },
    {
        "position": "right",
        "data": "0x26725d6aa68f0a8ecd589585b718166f9ad69d9cdc172aa05ab3a978e8350822"
    },
    {
        "position": "right",
        "data": "0x67f125be851fa6cba1c43a7881edaf467f9a2c668f555298b39c0a42aa3eabc7"
    }
]

// FrontEnd will verify using by doing the following:

const tree = new MerkleTree([], (x) => sha3(x, { outputLength: 256 } ))

let leafEncrypted = (Object.entries(apiParam.leaf).map(x => sha3(x.toString(),{ outputLength: 256 })))
leafEncrypted = tree.bufferToHex(leafEncrypted)

let merkleRoot = tree.bufferify("Srqv=w?i<hTj3@/4kO#50[@Pe")
const merkleRoot1 = "0x93d372f1763d96f73fe93c9b1ce815d4ea3340af1db46b4f23353084db405065" // chainLink

const testTree = tree.verify(proof, leafEncrypted, merkleRoot)

console.log(`testTree`, testTree)
