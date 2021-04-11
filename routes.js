const express = require("express")
const Loan = require("./models/Loan")
const Lender = require("./models/Lender")
const sha3 = require('crypto-js/sha3');
const { MerkleTree } = require('merkletreejs')
const router = express.Router()
const BN = require('bn.js');

// Add a Client Identifying Info
// Merkle root generated after info is obtained
router.post("/applyloan", async (req, res) => {
    Loan.init()
    const merkle = getMerkleTree({
        fullname: req.body.fullname,
        email: req.body.email,
        address: req.body.address,
        passportid: req.body.passportid,
        monthlysalary: req.body.monthlysalary,
        monthlyspending: req.body.monthlyspending,
    })
    const post = new Loan({
        _id: req.body.loanid,
        tokentype: req.body.tokentype,
        duration: req.body.duration,
        loanamount: req.body.loanamount,
        collateraltoken: req.body.collateraltoken,
        collateralamount: req.body.collateralamount,
        loanid: req.body.loanid,
        merkleroot: merkle.root,
        merkletree: merkle.tree,
        fullname: req.body.fullname,
        email: req.body.email,
        address: req.body.address,
        passportid: req.body.passportid,
        monthlysalary: req.body.monthlysalary,
        monthlyspending: req.body.monthlyspending,
        paymentcontractaddress: req.body.paymentcontractaddress,
        erc20address: req.body.erc20address,
        isapproved: "initiated",
        installmentinterval : 30,
        installments: req.body.duration, 
        accruedinterest: 0
      })
    try {
        await post.save()
    } catch (err) {
        //silently ignored
    }

	res.send(post)
})

function getMerkleTree(params) {

    return buildTree(params)
}

function buildTree(jsonInput){
    const leaves = (Object.entries(jsonInput).map(x => sha3(x.toString(),{ outputLength: 256 })))

    const tree = new MerkleTree(leaves, (x) => sha3(x, { outputLength: 256 } ));

    const root = new BN(tree.getRoot().toString('hex'), 16).toString();
    const hexLayers = tree.getHexLayers()
    const hexLeaves = tree.getHexLeaves()
    tree.leaves = hexLeaves
    tree.layers = hexLayers
    return {tree: tree, root: root};
}


// Get all Loans associated with an erc20Address
router.put("/getproof", async (req, res) => {
	const posts = await Loan.find({_id: req.body.loanid})
    const tree = posts[0].merkletree
    const leafEncrypted = (Object.entries(req.body.leaf).map(x => sha3(x.toString(),{ outputLength: 256 })))
    const proof = getProof(leafEncrypted[0], tree)
	res.send(proof)
})

function getProof(leaf, tree,  index) {
    leaf = MerkleTree.bufferify(leaf);
    const proof = [];
    if (!Number.isInteger(index)) {
        index = -1;
        
        for (let i = 0; i < tree.leaves.length; i++) {
            if (Buffer.compare(leaf, MerkleTree.bufferify(tree.leaves[i])) === 0) {
                index = i;
            }
        }
    }
    if (index <= -1) {
        return [];
    }
        for (let i = 0; i < tree.layers.length; i++) {
            const layer = MerkleTree.bufferify(tree.layers[i]);
            const isRightNode = index % 2;
            const pairIndex = (isRightNode ? index - 1 : index + 1);
            if (pairIndex < layer.length) {
                proof.push({
                    position: isRightNode ? 'left' : 'right',
                    data: layer[pairIndex]
                });
            }
            // set index to parent index
            index = (index / 2) | 0;
        }
        return proof;

}


// Get all Loans associated with an erc20Address
router.get("/getloans/:erc20address", async (req, res) => {
    console.log("This is req",req)
	const posts = await Loan.find({erc20address: req.params.erc20address})
    // .select({"loanid":0})
    .select({"_id":0, "loanid":1, "isapproved":1,"loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1})
	res.send(posts)
})

// update loan status
router.put("/updateloan", async (req, res) => {
    const loan = await Loan.findOne({ loanid: req.body.loanid })
    loan.isapproved = req.body.isapproved 
    await loan.save()
	res.send(loan)
})

// Get all Loans detail
router.get("/getloansdetails/:loanid", async (req, res) => {
	const posts = await Loan.find({_id: req.params.loanid})
    // .select({"loanid":0})
    .select({"_id":0, "loanid":1, "isapproved": 1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1, "installmentinterval": 1, "installments": 1, "merkleroot": 1})
	res.send(posts[0])
})

router.get("/getloanunapproved", async (req, res) => {
	const posts = await Loan.find({isapproved: "initiated"})
    .select({"_id":0, "loanid":1, "isapproved": 1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1})
	res.send(posts)
})


// Add a Client loans
// Approves Loan as well
router.post("/buyloan", async (req, res) => {
    Lender.init()
    let post = await Lender.findOne({ erc20address: req.body.erc20address})
    if(post !== null){
        loans = post.loans
        loans.push(req.body.loanid)
        post.loans = loans
    } else {
        post = new Lender({
            _id: req.body.erc20address,
            erc20address: req.body.erc20address,
            loans: [req.body.loanid],
          })
    }
    try {
        await post.save()
    } catch (err) {
        console.log(`err`, err)
    }
	res.send(post)
})

router.get("/getlendedloans/:erc20address", async (req, res) => {
    const post = await Lender.findOne({ erc20address: req.params.erc20address})
    let lendedLoans = []

    for( var i = 0; i < post.loans.length; i++){ 
        const loan = await Loan.findOne({ loanid: post.loans[i] })
        .select({"_id":0, "loanid":1, "isapproved": 1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1, "accruedinterest": 1})
        lendedLoans.push(loan)
    }
	res.send(lendedLoans)
})

// Get all Loans detail
router.get("/getlendeddetails/:loanid", async (req, res) => {
	const posts = await Loan.find({_id: req.params.loanid})
    // .select({"loanid":0})
    .select({"_id":0, "loanid":1, "isapproved": 1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1, "installmentinterval": 1, "installments": 1, "accruedinterest": 1})
	res.send(posts[0])
})






module.exports = router