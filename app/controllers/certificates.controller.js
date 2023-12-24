const Certificates = require('../models/certificates.model');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'info.englearn360@gmail.com', // Your email address
        pass: 'zgdazwoievzsasfx' // Your email password or an application-specific password
    }
});

module.exports = {
    //Create new Certificates
    createCertificates: async (req, res, next) => {
        const user_id = req.identity.id;
        const baseurl = req.headers.host;
        const firstName = req.identity.firstName;
        const lastName = req.identity.lastName;
        const email = req.identity.email;
        const inputImagePath = 'assets/cert.jpg';
        const outputImagePath = `public/certificates/${firstName+lastName}_certificate.png`; // Replace with your desired output image path
        let name = `${firstName} ${lastName}`
        const image = await loadImage(inputImagePath);
        // Create a canvas
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        // Draw the input image on the canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);
        // Add text overlay for the winner's name
        ctx.font = '22px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`${name}`, 560, 560);

        const imageBuffer = canvas.toBuffer('image/png');
        // Save the canvas to an output image file
        const out = fs.createWriteStream(outputImagePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`Certificate saved to ${outputImagePath}`);
        });
        const newCertificates = new Certificates({
            user_id:user_id,
            title: `${firstName+lastName}_certificate.png`,
            url: `http://${baseurl}/certificates/${firstName+lastName}_certificate.png`
        })

         // Email content
         const mailOptions = {
            from: 'info.englearn360@gmail.com',
            to: email,
            subject: 'Course completion Certificate ',
            text: `Hello ${firstName}, Congratulations! You successfullu completed the Lets Talk English course. Here is your certificate, Thank you!`,
            attachments: [
                {
                  filename: 'certificate.png',
                  content: imageBuffer,
                  encoding: 'base64',
                },
              ],
        };
        Certificates.create(newCertificates, (err, data) => {
            if (err) {
                return res.send({
                    success: false,
                    error: err,
                    message: 'Failed to create new Certificates'
                });
            } else {
                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error:', error.message);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                return res.send({
                    success: true,
                    id: data.id,
                    message: 'New Certificates emailed successfully'
                });
            }
        })
    },

    //View Single Certificates
    getCertificates: async (req, res, next) => {
        let id = req.identity.id;
        await Certificates.find({ "user_id": id, "status": true }).exec((err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "Certificates Not founded..!",
                    error: err ? err : "No active Certificates data in db"
                })
            }
            let result = {
                data: data[0],
                success: true
            }

            return res.send(result);
        })
    },
    // Get All Certificates
    listCertificates: async (req, res, next) => {
        let findObj = {
            status: true
        }

        await Certificates.find(findObj).exec((err, data) => {

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

    // //Update Certificates
    // updateCertificates: async (req, res, next) => {
    //     let id = req.params.id;
    //     let params = req.body;
    //     if (!params.title || !params.url) {
    //         return res.send({
    //             success: false,
    //             message: "Nothing to update"
    //         })
    //     }
    //     let update = params


    //     await Certificates.find({ "_id": id, "status": true }, async (err, data) => {
    //         if (err || data.length == 0) {
    //             return res.send({
    //                 success: false,
    //                 message: "Certificates Not founded with this CertificatesId"
    //             })
    //         }
    //         //if Certificates Existing
    //         await Certificates.findByIdAndUpdate(id,
    //             {
    //                 $set: update
    //             }, { new: true },
    //             (err, data) => {
    //                 if (err || !data) {
    //                     return res.send({
    //                         success: false,
    //                         message: "Certificates Updation failed..!"
    //                     })
    //                 }
    //                 return res.send({
    //                     success: true,
    //                     message: "Certificates Updated successfully"
    //                 })
    //             });
    //     })
    // },
    //Delete Certificates
    // deleteCertificates: async (req, res, next) => {
    //     let id = req.params.id;
    //     let update = {
    //         status: false
    //     }
    //     await Certificates.find({ "_id": id, "status": true }, async (err, data) => {
    //         if (err || data.length == 0) {
    //             return res.send({
    //                 success: false,
    //                 message: "Certificates Not founded with this CertificatesId"
    //             })
    //         }
    //         await Certificates.findByIdAndUpdate(id,
    //             {
    //                 $set: update
    //             }, { new: true },
    //             (err, data) => {
    //                 if (err || !data) {
    //                     return res.send({
    //                         success: false,
    //                         message: "Certificates Deletion failed..!"
    //                     })
    //                 }
    //                 return res.send({
    //                     success: true,
    //                     message: "Certificates Deleted successfully"
    //                 })
    //             });
    //     })
    // }

}