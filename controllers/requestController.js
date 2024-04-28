const { getUserId } = require('../middlewares/authMiddleware');
const {findPetDetails, sendRequestEmail, findPetDetailsWithAdoptRequest, setAcceptRequest, setRejectRequest} = require('../services/requestService')
const onGetPetDetails = (async (req, res) => {
    const petId = req.params['id']
    if(!petId) {
        return res.status(400).send('Invalid request, pet ID required.');
    }

    try {
        //get pet details
        const result = await findPetDetails(petId);
        res.status(200).send(result);  

    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
}) 

const onGetPetDetailsWithAdoptRequest = (async (req, res) => {
    const petId = req.params['id'];
    const key = req.query.key;
    if(!petId) {
        return res.status(400).send('Invalid request, pet ID required.');
    }
    if(!key) {
        return res.status(400).send('Invalid request, key required.');
    }

    try {
        //get pet details
        const result = await findPetDetailsWithAdoptRequest(petId, key);
        res.status(200).send(result);  

    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
})

const onSendRequestEmail= (async (req, res) => {
    const petRequest=  req.body;
    if (!petRequest.hasOwnProperty('petId') || !petRequest.hasOwnProperty('breed') ||
        !petRequest.hasOwnProperty('age') || !petRequest.hasOwnProperty('colour') ||
        !petRequest.hasOwnProperty('weight') || !petRequest.hasOwnProperty('description') ||
        !petRequest.hasOwnProperty('requestMessage') || !petRequest.hasOwnProperty('ownerEmail') ||
        !petRequest.hasOwnProperty('petImage')){

        return res.status(400).send({message: 'Invalid request, missing one or more required field(s).'});  
    }

    try{
        //send mail
        const result = await sendRequestEmail(petRequest);

        res.status(200).send({message: `Request email sent to pet owner. Email copied to ${result.requestUserEmail}`});  
    } catch (error) {
        res.status(500).send(error.message);  
    }
    return;
}) 

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

const onAcceptAdoptRequest = (async (req, res) => {
    const petId = req.params['id'];
    const key = req.query.key;
    if(!petId) {
        return res.status(400).send('Invalid request, pet ID required.');
    }
    if(!key) {
        return res.status(400).send('Invalid request, key required.');
    }

    try {
        //get pet details
        const result = await setAcceptRequest(petId, key);

        res.status(200).send(result);  

    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
})

const onRejectAdoptRequest = (async (req, res) => {
    const petId = req.params['id'];
    const key = req.query.key;
    if(!petId) {
        return res.status(400).send('Invalid request, pet ID required.');
    }
    if(!key) {
        return res.status(400).send('Invalid request, key required.');
    }

    try {
        //get pet details
        const result = await setRejectRequest(petId, key);
        res.status(200).send(result);  

    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
})

module.exports = {onGetPetDetails, onSendRequestEmail, onGetPetDetailsWithAdoptRequest, onAcceptAdoptRequest, onRejectAdoptRequest};
