const { queryDb } = require('../repository/queryDatabase');
const { getUserEmail, getUserName, getUserPhone, getUserId } = require("../middlewares/authMiddleware");

const currentDate = new Date();
const twoMonthsLater = new Date(currentDate);
twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

//Find pets by category
const findPetsByCategory = (async (petCategoryId) => {
    return new Promise(async(resolve,reject) => {
        try{
            const sql =`Select p.id_pet, p.breed, p.ageyear, p.agemonth, p.colour, p.likes, pi.id_pet_image, pi.image_path from "pet" p    
                inner join "pet_image" pi on p.id_pet=pi.id_pet where p.id_pet_category=$1 and p.is_active=true and p.is_adopted=false`
            const dbResult = await queryDb(sql, [petCategoryId]) 

            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'No pets found for the selected pet category.'});
                return;
            }

            let returnJson = [];
            dbResult.rows.map((row) => {
                returnJson.push({
                    petId: row.id_pet,
                    breed: row.breed,
                    age: `${row.ageyear} year(s) and ${row.agemonth} month(s)`,
                    petImageId: row.id_pet_image,
                    imagePath: row.image_path,
                    likes: row.likes
                })
            })

            resolve(returnJson);
        } catch (error) {
            reject({statusCode: 500, message: error.message});
        }
    })
})

const updateLikes = (async (petId, like) => {
    return new Promise(async(resolve,reject) => {
        try{
            const sql =`Update "pet" set likes=likes + $2 Where id_pet=$1 returning id_pet, likes `
            const dbResult = await queryDb(sql, [petId, like]) 

            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'No pets found for the selected pet category.'});
                return;
            }

            const returnJson ={
                likes: dbResult.rows[0].likes
            };

            resolve(returnJson);
        } catch (error) {
            reject({statusCode: 500, message: error.message});
        }
    })
})

//Create pet registration data in the pet table
const createPetRegistration = async (data) => {
    try {
      // insert pet information into table pet01
      data.id_user = getUserId();

      const petResult = await queryDb(
        'insert into "pet" (id_user, id_pet_category, breed, colour, weight, ageyear, agemonth, vaccination, vaccination_date, vaccination_hospital_name, description, publishing_date, post_expiry_date, is_active, is_adopted) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning *',
        [
          data.id_user,
          data.id_pet_category,
          data.breed,
          data.colour,
          data.weight,
          data.ageyear,
          data.agemonth,
          data.vaccination,
          data.vaccination_date,
          data.vaccination_hospital_name,
          data.description,
          currentDate, // publishing_date
          twoMonthsLater,
          true,
          false, //set these two columns default value
        ]
      );
  
      // insert pet image into table pet_image
      const petImageResult = await queryDb(
        'insert into "pet_image" (id_pet, image_path) values($1, $2) returning *',
        [petResult.rows[0].id_pet, data.file_name]
      );
  
      const result = {
        pet: petResult.rows ? petResult.rows : [],
        petImage: petImageResult.rows ? petImageResult.rows : [],
      };
      return { ...result };
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  };

//Find pet data from pet table
const findPetData = async () => {
  try {
    const dbResult = await queryDb(
      'select pet_image.id_pet_image, "user".id_user, pet.id_pet from pet inner join pet_image on pet.id_pet = pet_image.id_pet inner join "user" on pet.id_user = "user".id_user'
    );
    const resultRows = dbResult.rows ? dbResult.rows : [];
    return !resultRows ? [{}] : resultRows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findCategories = (async () => {
  return new Promise(async(resolve,reject) => {
      try{
          const dbResult = await queryDb('select id_pet_category, description from "pet_category"') 

          //check fetched records
          if (!dbResult.rows.length){
              reject({statusCode:404, message: 'No records available in the database.'});
              return;
          }

          let returnJson = []
          dbResult.rows.map(async (row)=> {
              returnJson.push({
                  petCategoryId: row.id_pet_category,
                  description: row.description
              })
          });
                      
          resolve(returnJson);
      } catch (error) {
          reject({statusCode: 500, message: error.message});
      }
  })
})

module.exports = { findPetsByCategory, updateLikes, createPetRegistration, findPetData, findCategories };