const { getAccessToken } = require('../helpers/jwtHelper');
const { matchPassword, hashPassword } = require('../helpers/hashStringHelper');
const { queryDb } = require('../repository/queryDatabase');
const { RandomString } = require('../helpers/commonHelper');
const { SendPasswordResetUrl } = require('./emailNotificationService')

const validateUser = ((userEmail, password) => {
    return new Promise(async(resolve,reject) => {
        if (!userEmail || !password) {
            reject({statusCode: 400, message: 'Email or password cannot be empty.'});
            return;
        }

        // *check the user email and password in database and generate access token (JWT)
        // *check in database
        try{

            const dbResult = await queryDb('select id_user, password, first_name, last_name, phone_number, is_active from "user" where email_address=$1', [userEmail]) 
            if (!dbResult.rows.length){ //if rows > 0
                reject({statusCode: 403, message: 'Invalid credentials, access denied.'});
                return;
            }

            //check status of the profile (active/inactive - is_active)
            if (!dbResult.rows[0].is_active){
                reject({statusCode: 403, message: 'Member profile is not activated. Please activate the profile and try again.'});
                return;
            }

            //validate hashed password
            if (! await matchPassword(password, dbResult.rows[0].password)){
                reject({statusCode: 403, message: 'Invalid credentials, access denied.'});
                return;
            }
            //get id_user and user name
            const id_user = dbResult.rows[0].id_user;
            const userName = `${dbResult.rows[0].first_name} ${dbResult.rows[0].last_name}`;
            const phoneNumber= dbResult.rows[0].phone_number;;

            // ?if fund in database and the password matches generate the JWT token
            // * payload to generate access token
            jwtPayload = {
                userId: id_user,
                userEmail: userEmail,
                userName: userName,
                phoneNumber: phoneNumber,
                isActive: true
            }

            // *generate access token
            const accessToken = getAccessToken(jwtPayload) 

            // *retiring json  with access token
            returnJson = {
                userId: id_user,
                userEmail: userEmail,
                userName: userName,
                phoneNumber: phoneNumber,                
                accessToken: accessToken
            }

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const forgetPassword = ((userEmail) => {
    return new Promise(async(resolve,reject) => {
        if (!userEmail) {
            reject({statusCode: 400, message: 'Email cannot be empty.'});
            return;
        }

        try{
            const resetKey = RandomString(25)
            //update resetKey in database
            let sql = 'update "user" set profile_activate_reset_string=$1 Where email_address=$2 and is_active=true ' 
            sql += 'returning '
            sql += 'id_user, email_address, first_name, last_name'

            //update member with resetKey 
            const dbResultSave = await queryDb(sql, [resetKey, userEmail]);

            //if not found
            if (!dbResultSave.rows.length){
                reject({statusCode: 400, message: 'Invalid email address.'});
                return;
            }

            //send password reset mail with url 
            await SendPasswordResetUrl(userEmail, resetKey)

            const returnJson = {
                userId: dbResultSave.rows[0].id_user,
                userEmail: dbResultSave.rows[0].email_address,
                userName: `${dbResultSave.rows[0].first_name} ${dbResultSave.rows[0].last_name}`
            }

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const resetPassword = ((resetKey, newPassword) => {
    return new Promise(async(resolve,reject) => {
        if (!resetKey || !newPassword) {
            reject({statusCode: 400, message: 'Password reset key or new password cannot be empty.'});
            return;
        }

        try{
            const hashedPassword = await hashPassword(newPassword)

            //update new password  in database
            let sql = 'update "user" set password=$1, profile_activate_reset_string=null Where profile_activate_reset_string=$2 and is_active=true ' 
            sql += 'returning '
            sql += 'id_user, email_address, first_name, last_name'

            //update member with resetKey 
            const dbResultSave = await queryDb(sql, [hashedPassword, resetKey]);

            //if not found
            if (!dbResultSave.rows.length){
                reject({statusCode: 400, message: 'Invalid password reset key.'});
                return;
            }

            const returnJson = {
                userId: dbResultSave.rows[0].id_user,
                userEmail: dbResultSave.rows[0].email_address,
                userName: `${dbResultSave.rows[0].first_name} ${dbResultSave.rows[0].last_name}`
            }

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})


module.exports = { validateUser, forgetPassword, resetPassword };