const {createCategory, findOneCategory, findCategories, updateCategory, deleteCategory} = require('../services/petCategoryService')

const onPetCategoryCreate = (async (req, res) => {
    const requestBody = req.body;
    //check description is available in the requesting payload
    if (!requestBody.hasOwnProperty('description')){
        return res.status(400).send('Invalid request, description required in payload.');  
    }
    
    try{
        //save pet category
        const result = await createCategory(requestBody.description);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
})     

const onGetPetCategory = (async (req, res) => {
    const petCategoryId = req.params['id'];
    //check category id is available as a path param
    if (!petCategoryId){
        return res.status(400).send('Invalid request, pet category ID required.');  
    }
    
    try{
        //get pet category details (single record)
        const result = await findOneCategory(petCategoryId);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
})     

const onGetPetCategories= (async (req, res) => {
    try{
        //get details of all the pet categories
        const result = await findCategories();
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
}) 

const onUpdatePetCategories= (async (req, res) => {
    const petCategoryId = req.params['id'];
    //check category id is available as a path param
    if (!petCategoryId){
        return res.status(400).send('Invalid request, pet category ID required.');  
    }

    const requestBody = req.body;
    //check description is available in the requesting payload
    if (!requestBody.hasOwnProperty('description')){
        return res.status(400).send('Invalid request, description required in payload.');  
    }

    try{
        //update description for the relevant category id 
        const result = await updateCategory(petCategoryId, requestBody.description);
        res.status(result===undefined?404:200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
}) 

const onDeletePetCategories= (async (req, res) => {
    const petCategoryId = req.params['id'];
    //check category id is available as a path param
    if (!petCategoryId){
        return res.status(400).send('Invalid request, pet category ID required.');  
    }

    try{
        //delete relevant category record
        const result = await deleteCategory(petCategoryId);
        res.status(result===undefined?404:200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
}) 

module.exports = {onPetCategoryCreate, onGetPetCategory, onGetPetCategories, onUpdatePetCategories, onDeletePetCategories};
