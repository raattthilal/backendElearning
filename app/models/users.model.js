const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
//User Schema
const UserSchema = mongoose.Schema({

    username: {type : String},

    password: { type: String },

    phone:  { type: Number },

    firstName: String,

    lastName: String,

    email: { type: String, required: true, unique: true},

    status : { type: Boolean, default: true},

    verified: { 
        type : Boolean,
        default: false 
    },
    paymentId: String,

    paymentStatus:{ 
        type: String,
        default:'PENDING'
    },

    role: { 
        type: String, 
        default: 'LEARNER' 
    },

    createdAt : {
        type: Date,
        default:Date.now(),
        select: false
    }
}, params);


const Users = module.exports = mongoose.model('Users', UserSchema);


module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function (username, callback) {
    const query = {
            $or: [
              { 'username': username , 'status': true },
              { 'email': username , 'status': true}
            ]
        }
    Users.find(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        callback(err, isMatch);
    });
};

module.exports.getUserById = function (id, callback) {
    Users.findById(id, callback);
};
