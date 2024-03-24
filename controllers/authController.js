const {validateUser} = require('../services/authService')
const onAuthorization = ((req, res) => {
    const requestBody = req.body;
    if (!requestBody.hasOwnProperty('userEmail') || !requestBody.hasOwnProperty('password')){
        return res.status(400).send('Invalid request, userEmail and password required.');  
    }
    
    try{
        const userEmail = requestBody.userEmail;
        const password = requestBody.password;
        const result = validateUser(userEmail, password);
        res.status(200).send(result);  
    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
})     


module.exports = {onAuthorization};
