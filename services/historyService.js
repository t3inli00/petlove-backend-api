const { queryDb } = require('../repository/queryDatabase');

//Find publishing histories of the target user in indicated range
const findHistoriesByRange = (async (id, start, end) => {
    try{
        const sql = `select p.publishing_date, pc.description, p.breed, p.adopted_on, u.first_name, u.last_name, p.adoption_remarks from "pet" p 
        inner join "pet_category" pc on p.id_pet_category=pc.id_pet_category
        left outer join "user" u on p.id_adopting_user = u.id_user where p.id_user=$1 and p.publishing_date between $2 and $3`
        const dbResult = await queryDb(sql, [id, start, end]) 
        const resultRows = dbResult.rows ? dbResult.rows : []
        return !resultRows? [{}]: resultRows;
    } catch (error) {
        console.log("find error")
        throw new Error(error.message);
    }
})

//Find all publishing histories of the target user
const findHistories = (async (id) => {
    try{
        const sql = `select p.publishing_date, pc.description, p.breed, p.adopted_on, u.first_name, u.last_name, p.adoption_remarks from "pet" p 
            inner join "pet_category" pc on p.id_pet_category=pc.id_pet_category
            left outer join "user" u on p.id_adopting_user = u.id_user where p.id_user=$1`
        const dbResult = await queryDb(sql, [id]) 
        const resultRows = dbResult.rows ? dbResult.rows : []
        return !resultRows? [{}]: resultRows;
    } catch (error) {
        throw new Error(error.message);
    }
})

module.exports = { findHistories, findHistoriesByRange};