const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['name', 'email', 'passportId', 'socialSecurityLast',].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
console.log(`tree`, tree)
const root = tree.getRoot().toString('hex') // need to save? who saves it? how? who verifies?

console.log(`root`, root)

const leaf = SHA256('name')
const proof = tree.getProof(leaf)
console.log(tree.verify(proof, leaf, root)) // true


const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
const badTree = new MerkleTree(badLeaves, SHA256)
const badLeaf = SHA256('x')
const badProof = tree.getProof(badLeaf)
console.log(tree.verify(badProof, leaf, root)) // false