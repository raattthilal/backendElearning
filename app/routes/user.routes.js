
module.exports = (app, methods) => {
    const User = methods.loadController('user');
    User.methods.get('list/', User.listUser, { auth: true });
    User.methods.get('get/:id', User.getUser, { auth: true });
    User.methods.post('create/', User.createUser, { auth: false });
    User.methods.put('update/:id', User.updateUser, { auth: true });
    User.methods.delete('delete/:id', User.deleteUser, { auth: true });
    User.methods.put('resetpassword/:id', User.resetPassword, { auth: true });

}