const mongoose = require("mongoose")

const schema = mongoose.Schema({
	_id: String,
	erc20address: String,
	loans: [String]
})

module.exports = mongoose.model("Lender", schema)