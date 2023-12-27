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

        if (!feesAmount || !passPercentage) {
            res.send({
                success: false,
                message: 'body is Empty..!'
            })
        }
        const newSettings = new Settings({
            feesAmount: feesAmount,
            passPercentage: passPercentage,
            questionTimer: questionTimer
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
        if (!params.feesAmount || !params.passPercentage || !params.questionTimer) {
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