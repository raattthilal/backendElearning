
module.exports = (app, methods) => {
    
    const Questions = methods.loadController('questions');

    Questions.methods.get('list/', Questions.listQuestions, { auth: true });
    Questions.methods.get('get/:id', Questions.getQuestion, { auth: true });
    Questions.methods.post('create/', Questions.createQuestion, { auth: true });
    Questions.methods.put('update/:id', Questions.updateQuestions, { auth: true });
    Questions.methods.delete('delete/:id', Questions.deleteQuestions, { auth: true });

}