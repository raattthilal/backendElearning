const mongoose = require('mongoose');

function transform(doc, ret) {
    var id = doc._id;
    delete ret._id;
    ret.id = id;
}
var params = {
    toObject: {
        transform: transform
    },
    toJSON: {
        transform: transform
    }
};
// Settings Schema
const SetingsSchema = mongoose.Schema({

    feesAmount: Number,
    passPercentage: Number,
    questionTimer:Number,
    created_at : {
        type: Date,
        default:Date.now()
      },

    status: {
        type : Boolean,
        default : true
            }

}, params);


const Settings = module.exports = mongoose.model('Settings', SetingsSchema);

