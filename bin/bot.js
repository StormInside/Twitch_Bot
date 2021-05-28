const tmi = require('tmi.js');
const Audic = require("audic")
const fs = require('fs');

var CONFIG = require('config');

var commands = JSON.parse(fs.readFileSync("./config/commands.json"));

const scripts = initScripts(commands);

const opts = {
  identity: {
    username: CONFIG.username,
    password: CONFIG.password,
  },
  channels: CONFIG.channels
};
const blacklist = CONFIG.blacklist;
const channel = CONFIG.channels[0];
const message_sound = CONFIG.message_sound;
const volume = CONFIG.volume;
const enable_change_color = CONFIG.enable_change_color;
const enable_message_sound = CONFIG.enable_message_sound;


const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on("join", sendHi);

client.connect();

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  blacklist.push(client.username);
}

function onMessageHandler (target, context, msg, self) {
  if (self) { return; }
  if (enable_message_sound && !(blacklist.includes(context.username.toLowerCase()))){
    playSound(message_sound, volume);
  }
  checkCommands(msg, target, context);
}

function sendHi(channel, username, self){
  if (self) { return; }
  if (! (blacklist.includes(username.toLowerCase()))){
    client.say(channel, `ZDAROVA ${username}`);
    console.log(`* ${username} joned`);
  }
}

module.exports = {
  chat_message: function(message){
    client.say(channel, message);
  },
  bot_scripts: scripts,
  bot_data: {
    "client": client,
    "target": channel,
    "context":{
      "username": channel
    }
  }
  // checkCommands : function(commandName){
  //   var target = channel;
  //   var context = {};
  //   context.username = client;
  //   if (commandName === '!dice' && commands['!dice'] === "enabled"){
  //     if (enable_change_color){client.color(randomColor()).then((data) => {}).catch((err) => {});}
  //     const num = rollDice();
  //     client.say(target, `You rolled a ${num}`);
  //   }
  //   else if (commandName === '!'){
  //     if (enable_change_color){client.color(randomColor()).then((data) => {}).catch((err) => {});}
  //     client.action(target, "color");
  //   }
  //   else if (commandName in commands){
  //     if (enable_change_color){client.color(randomColor()).then((data) => {}).catch((err) => {});}
  //     scripts[commandName].execute({"client": client,
  //                                   "target": target,
  //                                   "context": context})
  //   } 
  // }
}


function playSound(sound, volume){
  var audio = new Audic(sound);
  audio.volume = volume;
  audio.play();
}

function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}


function initScripts(commands){
  var scripts = {};
  for (var command in commands){
    if (commands[command].endsWith(".js")){scripts[command] = require("../bot_scripts/"+commands[command]);}
  }
  console.log(scripts);
  return scripts;
}

function checkCommands(msg, target, context){
  const commandName = msg.trim();
  if (commandName === '!dice' && commands['!dice'] === "enabled"){
    if (enable_change_color){client.color(randomColor()).then((data) => {}).catch((err) => {});}
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
  }
  else if (commandName === '!'){
    if (enable_change_color){client.color(randomColor()).then((data) => {}).catch((err) => {});}
    client.action(target, "color");
  }
  else if (commandName in scripts){
    if (enable_change_color){client.color(randomColor()).then((data) => {}).catch((err) => {});}
    scripts[commandName].execute({
      "client": client, 
      "msg": msg,
      "target": target,
      "context": context
    });
  }
  else if (commandName in commands){
    client.say(target, commands[commandName]);
  }
}

function randomColor(){
  var arr = [
      "Blue",
      "BlueViolet",
      "CadetBlue",
      "Chocolate",
      "Coral",
      "DodgerBlue",
      "Firebrick",
      "GoldenRod",
      "Green",
      "HotPink",
      "OrangeRed",
      "Red",
      "SeaGreen",
      "SpringGreen",
      "YellowGreen"];
  
  const randomColor = arr[Math.floor(Math.random() * arr.length)];
  return randomColor;
}
