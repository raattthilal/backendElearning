const Questions = require('../models/questions.model');
const Settings = require('../models/settings.model');
module.exports = {
    //Create new Question
    createQuestion: (req, res, next) => {
        const newQuestion = new Questions({
            question:req.body.question,
            options_1: req.body.options_1,
            options_2: req.body.options_2,
            options_3: req.body.options_3,
            options_4: req.body.options_4,
            key: req.body.key,
            status: true
        })
        Questions.create(newQuestion, (err, data) => {
            if (err) {
                return res.send({
                    success: false,
                    error: err,
                    message: 'Failed to create new Question'
                });
            } else {
                return res.send({
                    success: true,
                    id: data.id,
                    message: 'New Question created successfully'
                });
            }
        })
    },

    //View Single Question
    getQuestion: async (req, res, next) => {
        let id = req.params.id;
        await Questions.find({ "_id": id, "status": true }).exec(async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Question Not founded..!",
                    error: err ? err : "No active Question data in db"
                })
            }
            const response= {
                data:data[0],
                message:"Question fetched successfully",
                success:true
            }
            return res.send(response);
        })
    },
    // Get All Questions
    listQuestions: async (req, res, next) => {
        let sortObj = {
            modified_at:1
        }
        let findObj={
            status: true 
        }
        const settingsData = await Settings.find({ "status": "1" });
        let questionTimer=60;
        if(settingsData.length){
            passPercentage = settingsData[0].questionTimer;
        }
        await Questions.find(findObj).sort(sortObj).exec( (err, data) => {

            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "No Questions founded..!",
                    error: err ? err : "No active Question in db"
                })
            }
            let responseData = [];
            for (let i = 0; i < data.length; i++) {
                let resData = {
                    id: data[i].id,
                    question: data[i].question,
                    options_1: data[i].options_1,
                    options_2: data[i].options_2,
                    options_3: data[i].options_3,
                    options_4: data[i].options_4,
                    
                }
                responseData.push(resData);
            }
            let result = {
                data: responseData,
                timer:questionTimer,
                success: true
            }
            res.send(result);
        })
    },

    //Update Question
    updateQuestions: async (req, res, next) => {
        let id = req.params.id;
        let params = req.body;
        if (!params.question || !params.key || !params.options_1 || !params.options_2 || !params.options_3 || !params.options_4) {
            return res.send({
                success: false,
                message: "Nothing to update"
            })
        }
        let update = params;
        
        await Questions.find({ "_id": id, "status": true },async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Question Not founded with this QuestionId"
                })
            }
            //if Question Existing
            await Questions.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, data) => {
                    if (err || !data) {
                        return res.send({
                            success: false,
                            message: "Question Updation failed..!"
                        })
                    }
                    return res.send({
                        success: true,
                        message: "Question Updated successfully"
                    })
                });
        })
    },
    //Delete Question
    deleteQuestions: async (req, res, next) => {
        let id = req.params.id;
        let update = {
            status: false
        }
        await Questions.find({ "_id": id, "status": true },async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Question Not founded with this QuestionId"
                })
            }
            await Questions.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, data) => {
                    if (err || !data) {
                        return res.send({
                            success: false,
                            message: "Question Deletion failed..!"
                        })
                    }
                    return res.send({
                        success: true,
                        message: "Question Deleted successfully"
                    })
                });
        })
    }

}