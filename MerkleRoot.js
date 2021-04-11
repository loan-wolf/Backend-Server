const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const sha3 = require('crypto-js/sha3');

const leaves = ["Star Patrick", "Star@gmail.com", "Marine Drive, CA", "jfklmn30", 6000, 1000].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
console.log(`tree`, tree)
let root = tree.bufferToHex(tree.getRoot()) // need to save? who saves it? how? who verifies?
// root = tree.bufferToHex(tree.getRoot())
console.log(`rootHex`, root)
root = parseInt(root, 16)
console.log(`parseInt`, root)
// root = tree.bufferify(root).toString('hex')
// console.log(`rootHex2`, root)
// const leaf = SHA256("Star@gmail.com")
// const proof = tree.getProof(leaf, tree)
// // console.log(`proof`, proof)
// console.log(tree.verify(proof, leaf, root)) // true

// const testProof = [
//     {
//         "position": "left",
//         "data": "0x95e88cef628db121817527e1c825588d30f48dbea4c561ef5a18a2423087bcb6"
//     },
//     {
//         "position": "right",
//         "data": "0x26725d6aa68f0a8ecd589585b718166f9ad69d9cdc172aa05ab3a978e8350822"
//     },
//     {
//         "position": "right",
//         "data": "0x67f125be851fa6cba1c43a7881edaf467f9a2c668f555298b39c0a42aa3eabc7"
//     }
// ]

// let leafEncrypted = (Object.entries({ email: "Star@gmail.com"}).map(x => sha3(x.toString(),{ outputLength: 256 })))

// const treeTo = new MerkleTree([], (x) => sha3(x, { outputLength: 256 } ))
// leafEncrypted = treeTo.bufferToHex(leafEncrypted)
// const testTree = treeTo.verify(testProof, leafEncrypted, "0x93d372f1763d96f73fe93c9b1ce815d4ea3340af1db46b4f23353084db405065")

// console.log(`testTree`, testTree)

// step1: apply for loan in application, call get id from smart contract in FE // saving db
// contruct tree with (BE part)         
        // "loanid": "loan3",
        // "fullname": "Star Patrick",
        // "email": "Star@gmail.com",
        // "address": "Marine Drive, CA",
        // "passportid": "jfklmn30",
        // "monthlysalary": 6000,
        // "monthlyspending": 1000,
// wait
// then configureNew ()
// 
// Proof API:
// api ( {leaf, loanid}  )
// returns: proof, // json object

// loanDetails

// const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
// const badTree = new MerkleTree(badLeaves, SHA256)
// const badLeaf = SHA256('x')
// const badProof = tree.getProof(badLeaf)
// console.log(tree.verify(badProof, leaf, root)) // false