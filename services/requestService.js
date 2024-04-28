const { queryDb } = require('../repository/queryDatabase');
const { getUserEmail, getUserName, getUserPhone, getUserId } = require("../middlewares/authMiddleware");
const {PetAdaptationRequest} = require("./emailNotificationService");
const { RandomString } = require('../helpers/commonHelper');

//Find pet details and image path
const findPetDetails = (async (id) => {
    try{
        const sql = `select email_address, breed, ageYear, ageMonth, colour, weight, description, image_path from pet 
            inner join pet_image on pet.id_pet = pet_image.id_pet 
            inner join "user" on pet.id_user= "user".id_user where pet.id_pet =$1`
        const dbResult = await queryDb(sql, [id]) 
        const resultRows = dbResult.rows ? dbResult.rows : []
        return !resultRows? [{}]: resultRows;
    } catch (error) {
        throw new Error(error.message);
    }
})

// Find owner's email address
const sendRequestEmail = (async (petRequest) => {
    return new Promise(async(resolve,reject) => {        
        petRequest['requestUserEmail'] = getUserEmail();
        petRequest['requestUserName'] = getUserName();
        petRequest['requestUserPhoneNumber'] = getUserPhone();
        //generate acceptance key
        const acceptanceKey = await generateAcceptanceKey(petRequest.petId, petRequest.requestMessage, getUserId());
        petRequest.acceptKey = acceptanceKey;

        try{
            //send email 
            await PetAdaptationRequest(petRequest, "to")
            await PetAdaptationRequest(petRequest, "cc")
            resolve(petRequest);
        } catch (error) {
            reject("Error sending request mail to pet owner. Please try again")
        }

    })
})

const generateAcceptanceKey= async (petId, message, userId) => {
    const acceptanceKey =  RandomString(25);


    let sql = 'insert into "pet_adaptation_request" (id_pet, adopt_request_id_user, message, adopt_request_key) values ($1, $2, $3, $4)'
    await queryDb(sql, [petId, userId, message, acceptanceKey]);
    return acceptanceKey;
}

const findPetDetailsWithAdoptRequest = (async (id, requestKey) => {
    try{
        const sql = `select "user".email_address, breed, ageYear, ageMonth, colour, weight, description, image_path, 
                pet_adaptation_request.message, usr.first_name || ' ' || usr.last_name request_user_name, 
                usr.email_address request_user_email, usr.phone_number 
                from pet 
                    inner join pet_image on pet.id_pet = pet_image.id_pet 
                    inner join "user" on pet.id_user= "user".id_user
                    inner join pet_adaptation_request on pet.id_pet = pet_adaptation_request.id_pet
                    inner join "user" as usr on pet_adaptation_request.adopt_request_id_user = usr.id_user 
                where is_accepted=false and is_rejected=false and pet.id_pet = $1 and adopt_request_key=$2`

        const dbResult = await queryDb(sql, [id, requestKey]) 
        const resultRows = dbResult.rows ? dbResult.rows : []
        return !resultRows? [{}]: resultRows;
    } catch (error) {
        throw new Error(error.message);
    }
})

const setAcceptRequest = async (petId, key) => {
    try{
        //get user id
        let sql = 'select id_user from "pet" where id_pet=$1';
        const dbResult = await queryDb(sql, [petId]);
        const userId = dbResult.rows[0].id_user;

        sql = 'update "pet_adaptation_request" set is_accepted=true, is_rejected=false where id_pet=$1 and adopt_request_key=$2'
        await queryDb(sql, [petId, key]);
    
        //reject all other received requests
        sql = 'update "pet_adaptation_request" set is_accepted=false, is_rejected=true where id_pet=$1 and adopt_request_key!=$2'
        await queryDb(sql, [petId, key]);


        //update pet table with adaption details
        sql = 'update "pet" set is_active=false, is_adopted=true, id_adopting_user=$1, adopted_on=CURRENT_TIMESTAMP where id_pet=$2'
        await queryDb(sql, [userId, petId]);
        return {status: "Updated successfully"};    
    } catch (error) {
        console.log(error.message)
        throw new Error(error.message);
    }
}

const setRejectRequest = async (petId, key) => {
    try{
        let sql = 'update "pet_adaptation_request" set is_accepted=false, is_rejected=true where id_pet=$1 and adopt_request_key=$2'
        await queryDb(sql, [petId, key]);
        return {status: "Updated successfully"};
    } catch (error) {
        throw new Error(error.message);
    }    
}


module.exports = {findPetDetails, sendRequestEmail, findPetDetailsWithAdoptRequest, setAcceptRequest, setRejectRequest};