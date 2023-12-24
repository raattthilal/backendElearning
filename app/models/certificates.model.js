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
// Certificates Schema
const CertificatesSchema = mongoose.Schema({
    
    user_id: mongoose.Schema.Types.ObjectId,

    title: String,

    url:String,
    
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


const Certificates = module.exports = mongoose.model('Certificates', CertificatesSchema);



