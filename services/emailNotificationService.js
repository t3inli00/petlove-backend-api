const handlebars = require('handlebars');
const fs = require('fs');
const { SmtpTransporter } = require('../helpers/mailTransporterHelper')
const path = require('path');

//get originating email address
const SMTP_EMAIL = process.env.SMTP_EMAIL;

if (!SMTP_EMAIL){
  throw new Error("Originating email address is not defined");
}

handlebars.registerHelper('eq', function(arg1, arg2) {
  return arg1 === arg2;
});

//Send member profile activation notification
const SendProfileActivation = async (memberEmail, activationKey) => {
    //get template file .hbs
    const htmlTemplateSource = fs.readFileSync(path.join(__dirname, '../templates/activateUserAccount.hbs'), 'utf-8');

    //details to pass to the template
    //Profile activation url
    const activationUrl = (process.env.SERVER || "").endsWith(`/`)?
      `${process.env.FONT_END_BASE_URL}pages/activate-me.html?key=${activationKey}`:
      `${process.env.FONT_END_BASE_URL}/pages/activate-me.html?key=${activationKey}`;

    const templateData = {
      activationUrl:  activationUrl
    };

    const template = handlebars.compile(htmlTemplateSource);

    //bind HTML content with data
    const htmlContent = template(templateData);

    // Define email options
    const mailOptions = {
      from: SMTP_EMAIL,
      to: memberEmail,
      subject: "PetLove Member Profile Activation",
      html: htmlContent,
      attachments: [
        {
            filename: 'mailHeader.jpg',
            path:  path.join(__dirname, '../asserts/images/mailHeader.jpg'),
            cid: 'petlove', 
        },
        {
          filename: 'activate-button.jpg',
          path:  path.join(__dirname, '../asserts/images/activate-button.jpg'),
          cid: 'activate-button', 
        },
      ],
    };

    try{

      const transporter = SmtpTransporter();
      await transporter.sendMail(mailOptions);  
      return true;
    } catch (error) {
      throw new Error(error);
    }
}

//Password Reset for the member
const SendPasswordResetUrl = async (memberEmail, resetKey) => {
  //get template file .hbs
  const htmlTemplateSource = fs.readFileSync(path.join(__dirname, '../templates/forgotPassword.hbs'), 'utf-8');

  //details to pass to the template
  //Profile activation url
  const resetUrl = (process.env.FONT_END_BASE_UR || "").endsWith(`/`)?
    `${process.env.FONT_END_BASE_URL}pages/reset-password.html?key=${resetKey}`:
    `${process.env.FONT_END_BASE_URL}/pages/reset-password.html?key=${resetKey}`;

  const templateData = {
    resetUrl:  resetUrl
  };

  const template = handlebars.compile(htmlTemplateSource);

  //bind HTML content with data
  const htmlContent = template(templateData);

  // Define email options
  const mailOptions = {
    from: SMTP_EMAIL,
    to: memberEmail,
    subject: "Reset PetLove Member Profile Password",
    html: htmlContent,
    attachments: [
      {
          filename: 'mailHeader.jpg',
          path:  path.join(__dirname, '../asserts/images/mailHeader.jpg'),
          cid: 'petlove', 
      },
      {
        filename: 'reset-button.jpg',
        path:  path.join(__dirname, '../asserts/images/reset-button.jpg'),
        cid: 'reset-button', 
      },
    ],
  };

  try{
    const transporter = SmtpTransporter();
    await transporter.sendMail(mailOptions);  
    return true;
  } catch (error) {
    throw new Error(error);
  }
}


const PetAdaptationRequest = async (petRequest, requestType = "to") => {
    //get template file .hbs
    const htmlTemplateSource = fs.readFileSync(path.join(__dirname, '../templates/adaptationRequest.hbs'), 'utf-8');

    //details to pass to the template
    //Profile activation url
    const resetUrl = (process.env.FONT_END_BASE_UR || "").endsWith(`/`)?
      `${process.env.FONT_END_BASE_URL}pages/accept-adaption.html?id=${petRequest.petId}&key=${petRequest.acceptKey}`:
      `${process.env.FONT_END_BASE_URL}/pages/accept-adaption.html?id=${petRequest.petId}&key=${petRequest.acceptKey}`;

    const templateData = {
      pet_image: petRequest.petImage,
      petId: petRequest.petId,
      breed: petRequest.breed,
      age: petRequest.age,
      colour: petRequest.colour,
      weight: petRequest.weight,
      description: petRequest.description,
      requestMessage: petRequest.requestMessage,
      requestUserEmail: petRequest.requestUserEmail,      
      requestUserName: petRequest.requestUserName,      
      requestUserPhoneNumber: petRequest.requestUserPhoneNumber,      
      acceptUrl: resetUrl,
      recipientType: requestType
    };

    const template = handlebars.compile(htmlTemplateSource);

    // //bind HTML content with data
    const htmlContent = template(templateData);

    // Define email options
    let mailOptions;
    try{
      mailOptions = {
      from: SMTP_EMAIL,
      to: requestType=="to"? petRequest.ownerEmail: petRequest.requestUserEmail,
      // cc: petRequest.requestUserEmail,
      subject: requestType=="to"? "Pet Adaptation Request" : "Pet Adaptation Request - copy" ,
      html: htmlContent,
      attachments: [
        {
            filename: 'mailHeader.jpg',
            path:  path.join(__dirname, '../asserts/images/mailHeader.jpg'),
            cid: 'petlove', 
        },
        {
          filename: templateData.pet_image,
          path:  path.join(__dirname, '../public/images/' + templateData.pet_image),
          cid: 'petImage', 
        },
        {
          filename: 'accept-button.jpg',
          path:   requestType=="to"? path.join(__dirname, '../asserts/images/accept-button.jpg'): "",
          cid: 'accept-button', 
        },
      ],
    };
  } catch (error){
    console.log(error)
  }
  
    try{
      const transporter = SmtpTransporter();
      await transporter.sendMail(mailOptions);  
      return true;
    } catch (error) {
      throw new Error("Error sending email. Check the token validity. Exception : " + error.message);
    }
}

module.exports = {SendProfileActivation, SendPasswordResetUrl, PetAdaptationRequest};