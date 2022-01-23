const fs = require('fs')

const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

const SESSION_FILE_PATH = '../../whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
  },
  session: sessionCfg
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

client.on('authenticated', (session) => {
  sessionCfg = session
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err)
    }
  })
})

client.on('auth_failure', msg => {
	console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
	console.log('Client is ready!')
})

client.on('message_revoke_me', async (msg) => {
	console.log(`DELETED MESSAGES FROM: ${msg.from} MESSAGES: ${msg.body}`); // message before it was deleted.
});

client.on('change_battery', (batteryInfo) => {
	const { battery, plugged } = batteryInfo;
	console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('change_state', state => {
	console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
	console.log('Client was logged out', reason);
});

module.exports = {
	client,
	SESSION_FILE_PATH
}