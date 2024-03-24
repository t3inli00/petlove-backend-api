const { getAccessToken } = require('../helpers/jwtHelper');

const validateUser = ((userEmail, password) => {
    if (!userEmail || !password) {
        throw new Error('Email or password cannot be empty.');
    }

    // *check the user email and password in database and generate access token (JWT)
    // *check in database

    // ?if fund in database and the password matches generate the JWT token
    // * payload to generate access token
    jwtPayload = {
        userEmail: userEmail,
        userName: "Indunil Liyanage",
        isActive: true
    }

    // *generate access token
    const accessToken = getAccessToken(jwtPayload) 

    // *returing json  with access token
    returnJson = {
        userEmail: userEmail,
        userName: "Indunil Liyanage",
        accessToken: accessToken
    }

    return returnJson;
})

module.exports = { validateUser };