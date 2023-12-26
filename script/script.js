const mongoose = require("mongoose");
const User = require('../app/models/users.model.js');
const bcrypt = require('bcryptjs');
const Settings =  require('../app/models/settings.model.js');
const dbConfig = require('../config/database.config')['production'];

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
    if(err)console.log(err)
    else
    console.log("Connected to database ....");
});

//create password hash

    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash('password', salt, (err, hash) => {
    //         if (err) throw err;
    //         console.log(hash);
    //     });
    // });

//pass-Admin@360
const UserAdmin = new User({
    username: 'superAdmin',
    email:'info.englearn360@gmail.com',
    phone:9947488233,
    firstName:'super',
    lastName:'admin',
    password:'$2a$10$oSmRkY391JOLIpayNwlfaOMP17rZM3Q.UfOrf9dVSgP69zY5NyiFK',
    role: "SUPERADMIN"
})
UserAdmin.save();
console.log("admin created");

const SettingAdmin = new Settings({
    feesAmount:100,
    passPercentage:60
})
SettingAdmin.save();

console.log("settings created");