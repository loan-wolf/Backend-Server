const express = require("express")
const Client = require("./models/Client")
const Loan = require("./models/Loan")
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')
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


// Get all Loans that are unapproved
router.get("/loanunapproved", async (req, res) => {
	const posts = await Loan.find({approved: false})
	res.send(posts)
})

// Add a Client Identifying Info
// Merkle root generated after info is obtained
router.post("/client", async (req, res) => {
    Client.init()
    const post = new Client({
        _id: req.body.identifyingInfo.email, // email as _id
        identifyingInfo: {
            name: req.body.identifyingInfo.name,
            email: req.body.identifyingInfo.email,
            phone: req.body.identifyingInfo.phone,
            password: req.body.identifyingInfo.password,
            passportId: req.body.identifyingInfo.passportId,
            socialSecurity: (req.body.identifyingInfo.socialSecurity) ? req.body.identifyingInfo.socialSecurity : null,
            socialSecurityLastFour: (req.body.identifyingInfo.socialSecurityLastFour) ? req.body.identifyingInfo.socialSecurityLastFour : null,
            address: req.body.identifyingInfo.Address,
        },
        financialInfo: {
            region: (req.body.financialInfo) ? req.body.financialInfo.region : null,            
            savings_usd: (req.body.financialInfo) ? req.body.financialInfo.savings_usd : null,
            montly_income_usd: (req.body.financialInfo) ? req.body.financialInfo.montly_income_usd : null,
            FICO_credit_score: (req.body.financialInfo) ? req.body.financialInfo.montly_income_usd : null
        },
        merkleTree:{
            val:  req.body.identifyingInfo.name,        
            left: SHA256(req.body.identifyingInfo.email),       
            right: SHA256(SHA256(req.body.identifyingInfo.passportId)+SHA256(req.body.identifyingInfo.socialSecurityLastFour))      
        },
        loans: (req.body.loans) ? req.body.loans : []
    })
    try {
        await post.save()
    } catch (err) {
        //silently ignored
    }
	res.send(post)
})

// Add a Client loans
router.put("/clientloans", async (req, res) => {

    const post = await Client.findOne({ eth_address: req.body.address })
    if(post !== null){
        loans = post.loans
        loans.push({ loanId: req.body.loan.loanId, type: req.body.loan.type, payment_contract_address: req.body.loan.payment_contract_address})
        post.loans = loans
    } 
    try {
        await post.save()
    } catch (err) {
        //silently ignored
    }
	res.send(post)
})

//delete client loan
router.delete("/clientloans", async (req, res) => {
    Client.init()
    const post = await Client.findOne({ eth_address: req.body.address })
    if(post !== null){
        loans = post.loans
        for( var i = 0; i < loans.length; i++){ 
    
            if ( loans[i].loanId === req.body.loanId) { 
        
                loans.splice(i, 1); 
            }
        
        }
        post.loans = loans
    } 
    try {
        await post.save()
    } catch (err) {
        //silently ignored
    }
	res.send(post)
})

router.put("/client", async (req, res) => {
    Client.init()
    const post = await Client.findOne({ _id: req.body.email })
    if(post !== null){
        post.financialInfo = {
            region: (req.body.financialInfo) ? req.body.financialInfo.region : null,            
            savings_usd: (req.body.financialInfo) ? req.body.financialInfo.savings_usd : null,
            montly_income_usd: (req.body.financialInfo) ? req.body.financialInfo.montly_income_usd : null,
            FICO_credit_score: (req.body.financialInfo) ? req.body.financialInfo.montly_income_usd : null,
            eth_address: (req.body.financialInfo) ? req.body.financialInfo.eth_address : null,
        }
        post.eth_address = (req.body.financialInfo) ? req.body.financialInfo.eth_address : null
    } 
    try {
        await post.save()
    } catch (err) {
        //silently ignored
    }
	res.send(post)
})

// Add Loan
// Update client loans
router.post("/loaninfo", async (req, res) => {
    Loan.init()
    id = uuidv4()
	const post = new Loan({
        _id: req.body.loanId,
        borrower_address: req.body.borrower_address,
        payment_contract_address: req.body.payment_contract_address,
        payment_contract_index: req.body.payment_contract_index,
        payment_contract_documentation: req.body.payment_contract_documentation,
        approved: false
    })
    console.log(`post`, post)
    const client = await Client.findOne({ eth_address: req.body.borrower_address })
    if(client !== null){
        loans = client.loans
        loans.push({ loanId: req.body.loanId, type: "borrower", payment_contract_address: req.body.payment_contract_address})
        client.loans = loans
        await client.save()
    }
    
	await post.save()

	res.send(post)
})

// get client
router.get("/client/:email", async (req, res) => {
	try {
        console.log(`req.params.email`, req.params.email)
		const post = await Client.findOne({ _id: req.params.email })
        console.log(post)
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

// get loan
router.get("/loan/:loanid", async (req, res) => {
	try {
		const post = await Loan.findOne({ _id: req.params.loanid })
        console.log(post)
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

//Approve loan
router.put("/loan", async (req, res) => {
	try {
		const post = await Loan.findOne({ _id: req.body.loanId })
        post.approved = true
        console.log(`post`, post)
        await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

module.exports = router