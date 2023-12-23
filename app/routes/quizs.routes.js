
module.exports = (app, methods) => {
    
    const Quizs = methods.loadController('quizs');

    Quizs.methods.get('list/', Quizs.listQuizs, { auth: true });
    Quizs.methods.get('get/', Quizs.getQuizs, { auth: true });
    Quizs.methods.post('create/', Quizs.createQuizs, { auth: true });
    Quizs.methods.put('update/:id', Quizs.updateQuizs, { auth: true });
    Quizs.methods.delete('delee/:id', Quizs.deleteQuizs, { auth: true });

}