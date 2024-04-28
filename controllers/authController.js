const {validateUser, forgetPassword, resetPassword} = require('../services/authService')

const onAuthorization = (async (req, res) => {
    const requestBody = req.body;
    //check either email or password is there
    if (!requestBody.hasOwnProperty('userEmail') || !requestBody.hasOwnProperty('password')){
        return res.status(400).send({message: 'Invalid request, userEmail and password required.'});  
    }
    
    try{
        const userEmail = requestBody.userEmail;
        const password = requestBody.password;
        const result = await validateUser(userEmail, password);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})     

const onForgetPassword = (async (req, res) => {
    const requestBody = req.body;
    //check email exists
    if (!requestBody.hasOwnProperty('userEmail')){
        return res.status(400).send({message: 'Invalid request, userEmail required.'});  
    }
    
    try{
        const userEmail = requestBody.userEmail;
        const result = await forgetPassword(userEmail);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})  

const onResetPassword = (async (req, res) => {
    const resetKey = req.params["key"]
    const requestBody = req.body;
    //check new password exists
    if (!requestBody.hasOwnProperty('newPassword')){
        return res.status(400).send({message: 'Invalid request, new password required.'});  
    }
    
    try{
        const newPassword = requestBody.newPassword;
        const result = await resetPassword(resetKey, newPassword);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})  

module.exports = {onAuthorization, onForgetPassword, onResetPassword};
