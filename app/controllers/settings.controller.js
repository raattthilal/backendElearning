const Settings = require('../models/settings.model');

module.exports = {
    //Create new Settings
    createSettings:(req, res, next) => {
        const userRole = req.identity.role;
        if(userRole!='SUPERADMIN'){
            res.send({
                success: false,
                message: 'not an admin..!'
            }) 
        }
        const feesAmount = req.body.feesAmount;
        const passPercentage = req.body.passPercentage;
        const questionTimer = req.body.questionTimer;
        const questionCount = req.body.questionCount;

        if (!feesAmount || !passPercentage|| questionTimer || questionCount) {
            res.send({
                success: false,
                message: 'body is Empty..!'
            })
        }
        const newSettings = new Settings({
            feesAmount: feesAmount,
            passPercentage: passPercentage,
            questionTimer: questionTimer,
            questionCount: questionCount
        })
        Settings.create(newSettings, (err, data) => {
            if (err) {
                return res.send({
                    success: false,
                    error: err,
                    message: 'Failed to create settings'
                });
            } 
                return res.send({
                    success: true,
                    data: data,
                    message: 'Settings created successfully'
                });
        })
    },


    getSettings: async (req, res, next) => {
        await Settings.find({ "status": "1" }).exec((err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Settings Not founded..!",
                    error: err ? err : "No active Settings data in db"
                })
            }
            let result = {
                data: data[0],
                success: true
            }       
            return res.send(result);
        })
    },
     //Update Settings
     updateSettings: async (req, res, next) => {
        let id = req.params.id
        const userRole = req.identity.role;
        if(userRole!='SUPERADMIN'){
            res.send({
                success: false,
                message: 'not an admin..!'
            }) 
        }
        let params = req.body;
        if (!params.feesAmount || !params.passPercentage || !params.questionTimer || !params.questionCount) {
            return res.send({
                success: false,
                message: "Nothing to update"
            })
        }
        let update = params;
        
        await Settings.find({ "_id": id, "status": true },async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Settings Not founded"
                })
            }
            //if Question Existing
            await Settings.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, data) => {
                    if (err || !data) {
                        return res.send({
                            success: false,
                            message: "Settings Updation failed..!"
                        })
                    }
                    return res.send({
                        success: true,
                        message: "Settings Updated successfully"
                    })
                });
        })
    },
}