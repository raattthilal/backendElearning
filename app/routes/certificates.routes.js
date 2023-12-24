
module.exports = (app, methods) => {
    
    const Certificates = methods.loadController('certificates');

    Certificates.methods.get('list/', Certificates.listCertificates, { auth: true });
    Certificates.methods.get('get/', Certificates.getCertificates, { auth: true });
    Certificates.methods.post('create/', Certificates.createCertificates, { auth: true });

}