const Quizs = require('../models/quiz.model');
const Questions = require('../models/questions.model');

module.exports = {
    //Create new Tags
    createQuizs: async (req, res, next) => {
        const userId = req.identity.id;
        const answers = req.body.answers;
        const totalQuest = answers.length;
        let points=0;
        let pass='';
        if (!answers) {
            res.send({
                success: false,
                message: 'Answer is Empty..!'
            })
        }
        try{
         const QuestionsArr = await Questions.find({status: true});
        //cross check answers
        for (const userResponse of answers) {
            const question = QuestionsArr.find(q => q.id === userResponse.id);
            if( userResponse.answerKey === question.key){
                points++;
            }
        }
        let percentage = (points/QuestionsArr.length)*100;

        percentage >= 60 ? pass="PASS" : pass="FAILED" ;
        }catch(err){
            if(err){
                res.send({
                    success: false,
                    message: 'Something went wrong..!'
                })
            }
        }
        const newQuiz = new Quizs({
            user_id:userId,
            answers: req.body.answers,
            totalscore: `${points} / ${totalQuest}`,
            result: pass
        })
        Quizs.create(newQuiz, (err, data) => {
            if (err) {
                return res.send({
                    success: false,
                    error: err,
                    message: 'Failed to submit quiz'
                });
            } else {
                return res.send({
                    success: true,
                    data: data,
                    message: 'Quiz submitted successfully'
                });
            }
        })
    },

    //View Single Exam result
    getQuizs: async (req, res, next) => {
        let id = req.query.id ?? req.identity.id;
        let sortObj = {
            created_at:-1
        }
        await Quizs.find({ "user_id": id, "status": "1" }).sort(sortObj).exec((err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Exam result Not founded..!",
                    error: err ? err : "No active Exam results data in db"
                })
            }
            let result = {
                data: data[0],
                success: true
            }       
            return res.send(result);
        })
    },
    // // Get All Tagss
    // listTags: async (req, res, next) => {
    //     let findObj={
    //         status: 1 
    //     }
    //     if(req.query.name){
    //         findObj.name = { $regex: req.query.name }
    //     }
    //     await Tags.find(findObj).exec( (err, data) => {

    //         if (err || data.length == 0) {
    //             return res.send({
    //                 success: false,
    //                 message: "No Tagss founded..!",
    //                 error: err ? err : "No active Tagss data in db"
    //             })
    //         }

    //         let result = {
    //             data: data,
    //             success: true
    //         }
    //         res.send(result);
    //     })
    // },

    // //Update Tags
    // updateTags: async (req, res, next) => {
    //     let id = req.params.id;
    //     let params = req.body;
    //     if (!params.name) {
    //         return res.send({
    //             success: false,
    //             message: "Nothing to update"
    //         })
    //     }
    //     let update = {}

    //     update.name = params.name ? params.name : null;
               
    //     await Tags.find({ "_id": id, "status": "1" },async (err, data) => {
    //         if (err || data.length == 0) {
    //             return res.send({
    //                 success: false,
    //                 message: "Tags Not founded with this TagsId"
    //             })
    //         }
    //         //if Tags Existing
    //         await Tags.findByIdAndUpdate(id,
    //             {
    //                 $set: update
    //             }, { new: true },
    //             (err, data) => {
    //                 if (err || !data) {
    //                     return res.send({
    //                         success: false,
    //                         message: "Tags Updation failed..!"
    //                     })
    //                 }
    //                 return res.send({
    //                     success: true,
    //                     message: "Tags Updated successfully"
    //                 })
    //             });
    //     })
    // },
    // //Delete Tags
    // deleteTags: async (req, res, next) => {
    //     let id = req.params.id;
    //     let update = {
    //         status: 0
    //     }
    //     await Tags.find({ "_id": id, "status": "1" },async (err, data) => {
    //         if (err || data.length == 0) {
    //             return res.send({
    //                 success: false,
    //                 message: "Tags Not founded with this TagsId"
    //             })
    //         }
    //         await Tags.findByIdAndUpdate(id,
    //             {
    //                 $set: update
    //             }, { new: true },
    //             (err, data) => {
    //                 if (err || !data) {
    //                     return res.send({
    //                         success: false,
    //                         message: "Tags Deletion failed..!"
    //                     })
    //                 }
    //                 return res.send({
    //                     success: true,
    //                     message: "Tags Deleted successfully"
    //                 })
    //             });
    //     })
    // }

}