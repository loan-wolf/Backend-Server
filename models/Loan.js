const mongoose = require("mongoose")

const schema = mongoose.Schema({
    fullname: String,
    email: String,
    address: String,
    passportid: String,
    monthlysalary: Number,
    monthlyspending: Number,
    paymentcontractaddress: String,
    erc20address: String,
    loanamount: Number,
    installmentinterval: Number,
    tokentype: String,
    duration: Number,
    collateraltoken: String,
    collateralamount: Number,
    loanid: String,
    type: String,
    merkleroot: String,
    isapproved: Boolean,
    installmentinterval: Number,
    installments: Number
  })

module.exports = mongoose.model("Loan", schema)