const express = require("express")
const Client = require("./models/Client")
const Loan = require("./models/Loan")
const router = express.Router()

// Get all Clients
router.get("/client", async (req, res) => {
	const posts = await Client.find()
	res.send(posts)
})

// Get all Loans
router.get("/loan", async (req, res) => {
	const posts = await Loan.find()
	res.send(posts)
})

// Add a Client
router.post("/clientinfo", async (req, res) => {
    Client.init()
    const post = new Client({
        _id: req.body.address, // ethereum address
        identifyingInfo: {
            name: req.body.identifyingInfo.name,
            email: req.body.identifyingInfo.email,
            phone: req.body.identifyingInfo.phone,
            socialSecurity: req.body.identifyingInfo.socialSecurity,
            socialSecurityLastFour: req.body.identifyingInfo.socialSecurityLastFour,
            Address: req.body.identifyingInfo.Address,
        },
        financialInfo: {
            region: req.body.financialInfo.region,            
            savings_usd: req.body.financialInfo.savings_usd,
            montly_income_usd: req.body.financialInfo.montly_income_usd,
            FICO_credit_score: req.body.financialInfo.montly_income_usd
        },
        merkleTree:{
            val: req.body.merkleTree.val,        
            left: req.body.merkleTree.left,       
            right: req.body.merkleTree.right      
        },
        loans: req.body.loans
    })
    try {
        await post.save()
    } catch (err) {
        //silently ignored
    }
	res.send(post)
})

// Add Loan
router.post("/loaninfo", async (req, res) => {
    Loan.init()
	const post = new Loan({
        _id: req.body.loanId, //loan_id
        borrower_address: req.body.borrower_address,
        payment_contract_address: req.body.payment_contract_address,
        payment_contract_index: req.body.payment_contract_index,
        payment_contract_documentation: req.body.payment_contract_documentation,
    })
	await post.save()
	res.send(post)
})

router.get("/clientinfo/:address", async (req, res) => {
	try {
		const post = await Client.findOne({ _id: req.params.address })
        console.log(post)
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

router.get("/loaninfo/:loanid", async (req, res) => {
	try {
		const post = await Loan.findOne({ _id: req.params.loanid })
        console.log(post)
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

module.exports = router