const Certificates = require('../models/certificates.model');
module.exports = {
    //Create new Certificates
    createCertificates: (req, res, next) => {
        const newCertificates = new Certificates({
            title: req.body.title,
            url: "url_link"
        })
        Certificates.create(newCertificates, (err, data) => {
            if (err) {
                return res.send({
                    success: false,
                    error: err,
                    message: 'Failed to create new Certificates'
                });
            } else {
                return res.send({
                    success: true,
                    id: data.id,
                    message: 'New Certificates created successfully'
                });
            }
        })
    },

    //View Single Certificates
    getCertificates: async (req, res, next) => {
        let id = req.params.id;
        await Certificates.find({ "_id": id, "status": true }).exec((err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Certificates Not founded..!",
                    error: err ? err : "No active Certificates data in db"
                })
            }
            let result = {
                data: data,
                success: true
            }       
          
            return res.send(result);
        })
    },
    // Get All Certificates
    listCertificates: async (req, res, next) => {
        let findObj={
            status: true
        }
        
        await Certificates.find(findObj).exec( (err, data) => {

            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "No Certificates founded..!",
                    error: err ? err : "No active Certificates data in db"
                })
            }

            let result = {
                data: data,
                success: true
            }
            res.send(result);
        })
    },

    //Update Certificates
    updateCertificates: async (req, res, next) => {
        let id = req.params.id;
        let params = req.body;
        if (!params.title || !params.url) {
            return res.send({
                success: false,
                message: "Nothing to update"
            })
        }
        let update = params

               
        await Certificates.find({ "_id": id, "status": true },async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Certificates Not founded with this CertificatesId"
                })
            }
            //if Certificates Existing
            await Certificates.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, data) => {
                    if (err || !data) {
                        return res.send({
                            success: false,
                            message: "Certificates Updation failed..!"
                        })
                    }
                    return res.send({
                        success: true,
                        message: "Certificates Updated successfully"
                    })
                });
        })
    },
    //Delete Certificates
    deleteCertificates: async (req, res, next) => {
        let id = req.params.id;
        let update = {
            status: false
        }
        await Certificates.find({ "_id": id, "status": true },async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Certificates Not founded with this CertificatesId"
                })
            }
            await Certificates.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, data) => {
                    if (err || !data) {
                        return res.send({
                            success: false,
                            message: "Certificates Deletion failed..!"
                        })
                    }
                    return res.send({
                        success: true,
                        message: "Certificates Deleted successfully"
                    })
                });
        })
    }

}