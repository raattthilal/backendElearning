module.exports = (app, methods) => {
    const user = methods.loadController('authenticate');
    const User = methods.loadController('user');
    
    user.methods.post('login', user.authenticate, { auth: false });
    user.methods.post('forgetpassword', user.forgetPasword, { auth: false });
    User.methods.post('signup', User.createUser, { auth: false });
}
