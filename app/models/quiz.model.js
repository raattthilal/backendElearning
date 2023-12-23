const mongoose = require('mongoose');

require('./users.model');

function transform(doc, ret) {
    var id = doc._id;
    delete ret._id;
    ret.id = id;

if(ret.user_id){
    ret.users= ret.user_id;
    delete ret.user_id;
  }
  else{
    ret.users={
      username:'',
      email:'',
      phone:''
    }
  }
  
}
var params = {
    toObject: {
        transform: transform
    },
    toJSON: {
        transform: transform
    }
};
// Quiz Schema
const QuizSchema = mongoose.Schema({
    user_id: {
       ref:'Users',
       type :mongoose.Schema.Types.ObjectId
      },

    totalscore: String,

    answers: Array,

    result: {
      type:String,
      default:"PASS"
    },
    
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


const Quizs = module.exports = mongoose.model('Quizs', QuizSchema);

