const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['name', 'email', 'passportId', 'monthly_income',].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
console.log(`tree`, tree)
const root = tree.getRoot().toString('hex') // need to save? who saves it? how? who verifies?

console.log(`root`, root)

const leaf = SHA256('name')
const proof = tree.getProof(leaf)
console.log(`proof`, proof)
console.log(tree.verify(proof, leaf, root)) // true


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
// returns: proof,

// returns: verify

const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
const badTree = new MerkleTree(badLeaves, SHA256)
const badLeaf = SHA256('x')
const badProof = tree.getProof(badLeaf)
console.log(tree.verify(badProof, leaf, root)) // false