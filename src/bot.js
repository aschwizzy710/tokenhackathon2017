const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function (session, message) {

  console.log("The message is " + message.body)
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      paymentRequest(session, message)
      break
  }
}

function onMessage(session, message) {
  var username = session.user.username // logs username 

  if (message.body == "12345") {
    plant(session)
  }
  else if (message.body == "undefined") {
    paymentRequest()
  }
  else {
    welcome(session, username)
  }
}

// takes command from the button

function onCommand(session, command) {
  switch (command.content.value) {
    case 'plant': // plant a tree 
      plantMessage(session, `Please scan your seedling QR code to get information about where to plant it. You will be paid $1 upon verification that you have planted your seedling!`)
      //plant(session)
      break
    case 'verify': // verify a tree
      verifyMessage(session, 'For every image you verify, you will be compensated $0.1, i.e., 10 cents! Would you like to proceed?')
      break
    case 'fund': // fund a tree 
      fundMessage(session, `For $3 you can fund the growth of one seedling! It only costs $150 to grow a small forest. Please select an amount below to fund.`)
      break
    case 'about': // Learn more about the Treebot
      about(session)
      break
    case 'scan': // Scan QR code (not functional)
      scan(session)
      break
    case 'help': // Get help 
      help(session)
      break
  }
}

// takes care of payment

function sendRequest(session, message) {

  // session.reply(SOFA.PaymentRequest({
  //   "body": "Thanks for the great time! Can you send your share of the tab?",
  //   "value": "0xce0eb154f900000",
  //   "destinationAddress": "0x056db290f8ba3250ca64a45d16284d04bc6f5fbf"
  // }))
}

function paymentRequest(session) {

  // session.reply(SOFA.PaymentRequest({
  //   "body": "Thanks for the great time! Can you send your share of the tab?",
  //   "value": "0xce0eb154f900000",
  //   "destinationAddress": "0x056db290f8ba3250ca64a45d16284d04bc6f5fbf"
  // }))
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

// Welcome message 

function welcome(session, username) {
  sendMessage(session, `Hello ` + username + `, I am TreeBot, your reforestation friend. Tap “fund” to donate money towards planting a tree. Tap “plant” to earn money planting trees. Tap “verify” to help verify grown trees. To learn more about me and my mission, tap “about`)
}

// example of how to store state on each user

function verify(session) {

  /* Send a tree image to the user*/

  SOFA.Message({
    body: "Here you go...",
    attachments: [{
      "type": "image",
      "url": "farmer(1).jpg"
    }]
  })

  //   let verify = (session.get('verify') || 0) + 1
  //   session.set('verify', verify)
  //   sendMessage(session, `${verify}`)
}

function fund(session) {
  // request $1 USD at current exchange rates

  // NEEDS CODE - Request money from user with options
}


function plant(session) {
  //plantMessage(session, `Please scan your seedling QR code to get information about where to plant it. You will be paid $1 upon verification that you have planted your seedling!`)
  session.reply(`I will pay you $3 in 12 months for planting this Acacia Polyacantha`)
  session.reply(`It should be planted at this location *Geolocation*`)
  session.reply(`Ok, 12 months have not passed, but for the purpose of this hackathon please send us a photo of your tree for verification`)



}

function about(session) {
  sendMessage(session, `I am TreeBot and my mission is to restore land destroyed by deforestation. I’m starting in Africa, where I make it simple by mobilizing local communities to protect and nurture the land through planting trees. Restoring forests is not easy! But with TreeBot and the power of borderless payments, anybody can make the world a greener place. Made with ❤️ by the Blockchain Education Network.`)
}

function scan(session, message) {
  session.reply('This feature is currently under development. Please enter the code 12345 instead (it\'s much easier 😉)')
  const foo = 12345

  // get the reply message and match it with foo

}

function help(session) {
  session.reply('We are currently out of seedlings to fund! Stay tuned for the next batch so you too can play a part in reforestation.')
}


// HELPERS

// Generic message with 4 options: Plant, Verify, Fund, and About

function sendMessage(session, message) {
  let controls = [
    { type: 'button', label: 'Fund 💰', value: 'fund' },
    { type: 'button', label: 'Plant 🌲', value: 'plant' },
    { type: 'button', label: 'Verify ✔️', value: 'verify' },
    { type: 'button', label: 'About', value: 'about' },
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: true,
  }))
}

// Verify messsage shows three buttons - Yes, No and Help 

function verifyMessage(session, message) {
  let controls = [
    { type: 'button', label: 'Yes ✔️', value: 'verify' },
    { type: 'button', label: 'No ❌', value: 'welcome' }
    //{ type: 'button', label: 'Help❓', value: 'help' }
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: true,
  }))
}

// Plant message shows two options - Scan QR code and Help 

function plantMessage(session, message) {
  let controls = [
    { type: 'button', label: 'Scan QR code 📷', value: 'scan' },
    { type: 'button', label: 'Exit 🚪', value: 'about' }
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: true,
  }))
}

function fundMessage(session, message) {
  let controls = [
    { type: 'button', label: '$3', value: 'help' },
    { type: 'button', label: '$150', value: 'help' },
    { type: 'button', label: 'Exit 🚪', value: 'about' }
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: true,
  }))
}
