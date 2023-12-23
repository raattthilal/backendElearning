
module.exports = (app, methods) => {
    
    const Settings = methods.loadController('settings');

   
    Settings.methods.get('get/', Settings.getSettings, { auth: true });
    Settings.methods.post('create/', Settings.createSettings, { auth: true });
    Settings.methods.put('update/:id', Settings.updateSettings, { auth: true });

}