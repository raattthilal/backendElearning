
module.exports = (app, methods) => {
    
    const Certificates = methods.loadController('certificates');

    Certificates.methods.get('/list', Certificates.listCertificates, { auth: true });
    Certificates.methods.get('get/:id', Certificates.getCertificates, { auth: true });
    Certificates.methods.post('create/', Certificates.createCertificates, { auth: true });
    Certificates.methods.put('update/:id', Certificates.updateCertificates, { auth: true });
    Certificates.methods.delete('delete/:id', Certificates.deleteCertificates, { auth: true });

}