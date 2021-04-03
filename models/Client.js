const mongoose = require("mongoose")

const schema = mongoose.Schema({
     _id: String, // ethereum address
    identifyingInfo: {
        name: String, // mandatory
        email: String,
        phone: String,
        password: String,
        socialSecurity: Number,
        socialSecurityLastFour: Number,
        passportId: String, 
        Address: String
    },
    financialInfo: {
        region: Number,            
        savings_usd: Number,
        montly_income_usd: Number,
        FICO_credit_score: Number
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