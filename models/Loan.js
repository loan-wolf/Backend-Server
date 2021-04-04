const mongoose = require("mongoose")

const schema = mongoose.Schema({
	_id: String,
	borrower_address: String,
	payment_contract_address: String,
    payment_contract_index: Number,
    payment_contract_documentation: String,
	eth_address: String, 
	approved: Boolean
})

module.exports = mongoose.model("Loan", schema)