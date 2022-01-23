const { client } = require("../configs/wa-client");

const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

module.exports = checkRegisteredNumber