const { SESClient } = require("@aws-sdk/client-ses");
const REGION = "eu-north-1";
const sesClient = new SESClient({ region: REGION });

module.exports = { sesClient };