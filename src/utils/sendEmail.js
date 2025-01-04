const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");


const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "<h3></h3>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "Email body",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Hello from SES",   
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
      ],
    });
  };
  
  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
      "akshay77shetgar@gmail.com",
      "akshay11shetgar@gmail.com",
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  module.exports = { run };