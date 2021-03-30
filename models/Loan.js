const mongoose = require("mongoose")

const schema = mongoose.Schema({
	_id: String, //loan_id
	borrower_address: String,
	payment_contract_address: String,
    payment_contract_index: Number,
    payment_contract_documentation: String
})

module.exports = mongoose.model("Loan", schema)