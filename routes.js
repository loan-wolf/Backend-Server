const express = require("express")
const Loan = require("./models/Loan")
const Lender = require("./models/Lender")
const sha3 = require('crypto-js/sha3');
const { MerkleTree } = require('merkletreejs')
const router = express.Router()

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
        isapproved: false,
        installmentinterval : 30,
        installments: req.body.duration, 
        accruedinterest: 0
      })
      console.log("Hello",req);
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
    const leaves = Object.entries(jsonInput).map(x => sha3(x.toString(),{ outputLength: 256 }));
    const tree = new MerkleTree(leaves, (x) => sha3(x, { outputLength: 256 } ));
    const root = tree.bufferToHex(tree.getRoot());
    return {tree: tree, root: root};
}


// Get all Loans associated with an erc20Address
router.get("/getloans/:erc20address", async (req, res) => {
    console.log("This is req",req)
	const posts = await Loan.find({erc20address: req.params.erc20address})
    // .select({"loanid":0})
    .select({"_id":0, "loanid":1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1})
	res.send(posts)
})

// Get all Loans detail
router.get("/getloansdetails/:loanid", async (req, res) => {
	const posts = await Loan.find({_id: req.params.loanid})
    // .select({"loanid":0})
    .select({"_id":0, "loanid":1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1, "installmentinterval": 1, "installments": 1, "merkleroot": 1})
	res.send(posts)
})

router.get("/getloanunapproved", async (req, res) => {
	const posts = await Loan.find({isapproved: false})
    .select({"_id":0, "loanid":1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1})
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
    const loan = await Loan.findOne({ loanid: req.body.loanid })
    loan.isapproved = true
    await loan.save()
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
        .select({"_id":0, "loanid":1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1, "accruedinterest": 1})
        lendedLoans.push(loan)
    }
	res.send(lendedLoans)
})

// Get all Loans detail
router.get("/getlendeddetails/:loanid", async (req, res) => {
	const posts = await Loan.find({_id: req.params.loanid})
    // .select({"loanid":0})
    .select({"_id":0, "loanid":1, "loanamount":1, "duration":1, "collateraltoken":1, "collateralamount":1, "installmentinterval": 1, "installments": 1, "accruedinterest": 1})
	res.send(posts)
})






module.exports = router