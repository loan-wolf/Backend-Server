const mongoose = require("mongoose")

const schema = mongoose.Schema({
     _id: String, //email
     eth_address: String,
    identifyingInfo: {
        name: String, // mandatory
        email: String,
        phone: String,
        password: String,
        socialSecurity: Number,
        socialSecurityLastFour: Number,
        passportId: String, 
        address: String
    },
    financialInfo: {
        region: Number,            
        savings_usd: Number,
        montly_income_usd: Number,
        FICO_credit_score: Number,
        eth_address: String,
    },
    merkleTree:{
        val: Object,        
        left: Object,       
        right: Object      
    },
    loans: [
        Object
    ]
})

module.exports = mongoose.model("Client", schema)