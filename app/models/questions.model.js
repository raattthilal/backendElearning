const mongoose = require('mongoose');
require('./certificates.model');
require('./users.model');
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
// Question Schema
const QuestionSchema = mongoose.Schema({
    
    question:String,

    options_1:String,
    options_2:String,
    options_3:String,
    options_4:String,

    key:String,

    point: {type: Number, default : 1},

    modified_at: {
        type: Date,
        default:Date.now()
      },

    created_at : {
        type: Date,
        default:Date.now()
      },

    status: {
        type : Boolean,
        default : true
            }

}, params);


const Questions = module.exports = mongoose.model('Questions', QuestionSchema);

