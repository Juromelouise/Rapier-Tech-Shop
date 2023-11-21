const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    number: {
        type: Number,
        required: [true, 'Please enter phone number'],
        minLenght: [4, 'Phone number should exceed more than 4']
    },
    address: {
        type: String,
        required: [true, 'Please enter address'],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Supplier', supplierSchema);