const { queryDb } = require('../repository/queryDatabase');
const { SendProfileActivation } = require('./emailNotificationService')
const { RandomString } = require('../helpers/commonHelper');
const { hashPassword } = require('../helpers/hashStringHelper');

const createUser = ((user) => {
    return new Promise(async(resolve,reject) => {
        if (!user.userEmail || !user.password || !user.firstName || !user.lastName ||
            !user.address || !user.postalCode || !user.city || !user.phoneNumber){

            reject({statusCode: 400, message: 'Missing one of more required field(s).'});
            return;
        }

        try{
            const dbResult = await queryDb('select id_user from "user" where email_address=$1', [user.userEmail]) 

            //check email is already registered
            if (dbResult.rows.length){
                reject({statusCode: 302, message: 'Email address already registered with PetLove.'});
                return;
            }

            // generate activation string
            const activationString =  RandomString(25);
            const hashedPassword = await hashPassword(user.password);
            
            //save member profile
            //construct sql string
            let sql = 'insert into "user" (email_address, password, first_name, last_name, address, postal_code, city, ' 
            sql += 'phone_number, date_registered, is_active, profile_activate_reset_string) '
            sql += 'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning '
            sql += 'id_user, email_address, first_name, last_name, address, postal_code, city, ' 
            sql += 'phone_number, date_registered, is_active'

            //save member and create the profile
            const dbResultSave = await queryDb(sql, 
                [user.userEmail, hashedPassword, user.firstName, user.lastName, user.address, user.postalCode, 
                    user.city, user.phoneNumber, new Date, false, activationString]);

            const returnJson = {
                userId: dbResultSave.rows[0].id_user,
                userEmail: dbResultSave.rows[0].email_address,
                firstName: dbResultSave.rows[0].first_name,
                lastName: dbResultSave.rows[0].lastName,
                address: dbResultSave.rows[0].address,
                postalCode: dbResultSave.rows[0].postal_code,
                city: dbResultSave.rows[0].city,
                phoneNumber: dbResultSave.rows[0].phone_number,
                dateRegistered: dbResultSave.rows[0].date_registered,
                isActive: dbResultSave.rows[0].is_active
            }

            //send member notification
            await SendProfileActivation(user.userEmail, activationString);

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const activateUser = ((activationKey) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Activate member profile
            //construct sql string
            const sql = `update "user" set is_active=true, profile_activate_reset_string=null Where profile_activate_reset_string=$1 and is_active=false  
                returning 
                id_user, email_address, first_name, last_name, address, postal_code, city,  
                phone_number, date_registered, is_active`

            //update member and activate the profile
            const dbResultSave = await queryDb(sql, [activationKey]);

            //check record updated
            if (!dbResultSave.rows.length){
                reject({statusCode: 400, message: 'Invalid activation key. No member profile found to activate'});
                return;
            }

            const returnJson = {
                userId: dbResultSave.rows[0].id_user,
                userEmail: dbResultSave.rows[0].email_address,
                firstName: dbResultSave.rows[0].first_name,
                lastName: dbResultSave.rows[0].lastName,
                address: dbResultSave.rows[0].address,
                postalCode: dbResultSave.rows[0].postal_code,
                city: dbResultSave.rows[0].city,
                phoneNumber: dbResultSave.rows[0].phone_number,
                dateRegistered: dbResultSave.rows[0].date_registered,
                isActive: dbResultSave.rows[0].is_active
            }

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const findOneUser = ((userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            const sql = `select id_user, email_address, first_name, last_name, address, postal_code, city,  
                phone_number, date_registered, is_active from "user" where id_user=$1`
    
            //update member and activate the profile
            const dbResult = await queryDb(sql, [userId]);
    
            //check fetched records
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid user id, user not found.'});
                return;
            }
    
            const returnJson = {
                userId: dbResult.rows[0].id_user,
                userEmail: dbResult.rows[0].email_address,
                firstName: dbResult.rows[0].first_name,
                lastName: dbResult.rows[0].last_name,
                address: dbResult.rows[0].address,
                postalCode: dbResult.rows[0].postal_code,
                city: dbResult.rows[0].city,
                phoneNumber: dbResult.rows[0].phone_number,
                dateRegistered: dbResult.rows[0].date_registered,
                isActive: dbResult.rows[0].is_active
            }
    
            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const findUsers = ((userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            const sql = `select id_user, email_address, first_name, last_name, address, postal_code, city,  
                phone_number, date_registered, is_active from "user" order by id_user`
    
            //update member and activate the profile
            const dbResult = await queryDb(sql);
    
            //check fetched records
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'No users available in the database.'});
                return;
            }


            let returnJson = []
            dbResult.rows.map(async (row)=> {
                returnJson.push({
                    userId: row.id_user,
                    userEmail: row.email_address,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    address: row.address,
                    postalCode: row.postal_code,
                    city: row.city,
                    phoneNumber: row.phone_number,
                    dateRegistered: row.date_registered,
                    isActive: row.is_active
                })
            });
        
            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const findOneUserByKey = ((key) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            let sql = 'select id_user, email_address, first_name, last_name, address, postal_code, city, ' 
            sql += 'phone_number, date_registered, is_active from "user" where profile_activate_reset_string=$1'
    
            //update member and activate the profile
            const dbResult = await queryDb(sql, [key]);
    
            //check fetched records
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid key, user not found.'});
                return;
            }
    
            const returnJson = {
                userId: dbResult.rows[0].id_user,
                userEmail: dbResult.rows[0].email_address,
                firstName: dbResult.rows[0].first_name,
                lastName: dbResult.rows[0].last_name,
                address: dbResult.rows[0].address,
                postalCode: dbResult.rows[0].postal_code,
                city: dbResult.rows[0].city,
                phoneNumber: dbResult.rows[0].phone_number,
                dateRegistered: dbResult.rows[0].date_registered,
                isActive: dbResult.rows[0].is_active
            }

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})


module.exports = { createUser, activateUser, findOneUser, findUsers, findOneUserByKey};