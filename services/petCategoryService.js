const { queryDb } = require('../repository/queryDatabase');

//Create category record in the pet_category table
const createCategory = (async (categoryDescription) => {
    return new Promise(async(resolve,reject) => {
        try{
            const dbResult = await queryDb('insert into "pet_category" (description) values($1) returning id_pet_category, description', [categoryDescription]) 
            
            const returnJson = {
                petCategoryId: dbResult.rows[0].id_pet_category,
                description: dbResult.rows[0].description
            }

            resolve(returnJson);
        } catch (error) {
            reject({statusCode: 500, message: error.message});
        }
    })
})

//Find category record from pet_category table
const findOneCategory = (async (id) => {
    return new Promise(async(resolve,reject) => {
        try{
            const dbResult = await queryDb('select id_pet_category, description from "pet_category" where id_pet_category=$1', [id]) 

            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid pet category id, id not found.'});
                return;
            }

            const returnJson = {
                petCategoryId: dbResult.rows[0].id_pet_category,
                description: dbResult.rows[0].description
            }

            resolve(returnJson);
        } catch (error) {
            reject({statusCode: 500, message: error.message});
        }
    })
})

//Find all category records from pet_category table
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

//Update category record in pet_category table
const updateCategory = (async (id, categoryDescription) => {
    return new Promise(async(resolve,reject) => {
        try{
            const dbResult = await queryDb('update "pet_category" set description=$1 where id_pet_category=$2 returning id_pet_category, description', [categoryDescription, id]) 
            
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid pet category id. Cannot update the record, id not found.'});
                return;
            }

            const returnJson = {
                petCategoryId: dbResult.rows[0].id_pet_category,
                description: dbResult.rows[0].description
            }

            resolve(returnJson);
        } catch (error) {
            reject({statusCode: 500, message: error.message});
        }
    })
})

//Delete category record from pet_category table
const deleteCategory = (async (id) => {
    return new Promise(async(resolve,reject) => {
        try{
            const dbResult = await queryDb('delete from "pet_category" where id_pet_category=$1 returning id_pet_category, description', [id]) 
  
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid pet category id. Cannot update the record, id not found.'});
                return;
            }

            const returnJson = {
                petCategoryId: dbResult.rows[0].id_pet_category,
                description: dbResult.rows[0].description
            }

            resolve(returnJson);
        } catch (error) {
            reject({statusCode: 500, message: error.message});
        }

    })
})

module.exports = { createCategory, findOneCategory, findCategories, updateCategory, deleteCategory };