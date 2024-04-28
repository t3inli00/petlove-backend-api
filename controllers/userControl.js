const {createUser, activateUser, findOneUser, findUsers, findOneUserByKey } = require('../services/userService')

const onRegister = (async (req, res) => {
    const requestBody = req.body;
    //check for required poperies 
    if (!requestBody.hasOwnProperty('userEmail') || !requestBody.hasOwnProperty('password') ||
        !requestBody.hasOwnProperty('firstName') || !requestBody.hasOwnProperty('lastName') ||
        !requestBody.hasOwnProperty('address') || !requestBody.hasOwnProperty('postalCode') ||
        !requestBody.hasOwnProperty('city') || !requestBody.hasOwnProperty('phoneNumber') ){

        return res.status(400).send({message: 'Invalid request, missing one or more required field(s).'});  
    }
    
    try{
        const user = req.body;

        const result = await createUser(requestBody);
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})     

const onActivate = (async (req, res) => {
    const activationKey = req.params["key"];
    //check for required poperies 
    if (!activationKey){
        return res.status(400).send({message: 'Invalid request, missing activation key.'});  
    }
    
    try{
        const result = await activateUser(activationKey);
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})     

const onFindOneUser = (async (req, res) => {
    const userId = req.params["userId"];
    //check for required poperies 
    if (!userId){
        return res.status(400).send({message: 'Invalid request, missing user id.'});  
    }
    
    try{
        const result = await findOneUser(userId);
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})   

const onFindUsers = (async (req, res) => {    
    try{
        const result = await findUsers();
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})  

const onFindOneUserByKey = (async (req, res) => {
    const key = req.params["key"];
    //check for required poperies 
    if (!key){
        return res.status(400).send({message: 'Invalid request, missing key.'});  
    }
    
    try{
        const result = await findOneUserByKey(key);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})   

module.exports = {onRegister, onActivate, onFindOneUser, onFindUsers, onFindOneUserByKey};
