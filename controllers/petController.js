const {findPetsByCategory, updateLikes, createPetRegistration,findPetData} = require('../services/petService');

const onGetPetByCategory = (async (req, res) => {
    const petCategoryId = req.params['id'];
    //check category id is available as a path param
    if (!petCategoryId){
        return res.status(400).send('Invalid request, pet category ID required.');  
    }
    
    try{
        //get pet by category (single record)
        const result = await findPetsByCategory(petCategoryId);
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
}) 

const onUpdateLikes = (async (req, res) => {
    const petId = req.params['id'];
    const likes = req.body.likes || 0
    //check pet Id is available as a path param
    if (!petId){
        return res.status(400).send('Invalid request, pet ID required.');  
    }

    if (likes===0){
        return res.status(400).send('Invalid request, like property required.');  
    }

    try{
        //get pet by category (single record)
        const result = await updateLikes(petId, likes>0?1:-1);

        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});    
    }
    return;
})

const onPetRegistrationCreate = async (req, res) => {
  try {
      // Check if both pet and pet image information were successfully created
      if (req.files && req.files.image) {
        const file = req.files.image;
  
        // Get pet data after successful insertion
        const petData = await findPetData();
        // console.log(petData);
        const lastPetData = petData[petData.length - 1];
        // Construct file name using id_pet_image, id_user, and id_pet
        let file_name = `${lastPetData.id_pet_image + 1}_${lastPetData.id_user}_${
          Number(lastPetData.id_pet) + 1
        }.jpg`;

        // Save pet registration data
        const result = await createPetRegistration({
          id_user: req.body.id_user,
          id_pet_category: req.body.id_pet_category,
          breed: req.body.breed,
          colour: req.body.colour,
          weight: req.body.weight,
          ageyear: req.body.ageyear,
          agemonth: req.body.agemonth,
          vaccination: req.body.vaccination,
          vaccination_date: req.body.vaccination_date,
          vaccination_hospital_name: req.body.vaccination_hospital_name,
          description: req.body.description,
          is_active: true,
          is_adopted: false,
          id_pet: req.body.id_pet,
          file_name: file_name,
        });
  
        const uploadPath = `./public/images/${file_name}`;
        file.mv(uploadPath, (err) => {
          if (err) {
            res.status(500).send(`Error uploading image. ${err.message}`);
            return;
          }
        });
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

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
  
module.exports = {onGetPetByCategory, onUpdateLikes, onPetRegistrationCreate,onGetPetCategories};