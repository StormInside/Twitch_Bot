var express = require('express');
var router = express.Router();
var validation = require('./validation');

var CONFIG = require('config');

const bot = require("../bin/bot.js")
var bot_scripts = bot.bot_scripts
var bot_data = bot.bot_data
var bot_commands = bot.commands

var scripts = []
for (key in bot_scripts){
  scripts.push(key)
}



router.get('/', function(req, res, next) {

  if (!CONFIG.has("password")){
    res.redirect("/login");
  }

  res.render('index', {scripts: scripts});
});

router.get('/login', function(req, res, next){
  data = CONFIG;
  data.channel = CONFIG.channels[0].replace('#','');
  res.render('login', {data:data} );
});

router.get('/settings', function(req, res, next){
  data = CONFIG;
  data.channel = CONFIG.channels[0].replace('#','');
  // var blacklist = "";
  // for (var item in data.blacklist){
  //   if (item == 0){blacklist = CONFIG.blacklist[item];}
  //   else{blacklist = blacklist+", "+CONFIG.blacklist[item];}
  // };
  // console.log(blacklist)
  // data.blacklist = blacklist;
  res.render('settings', {commands: bot_commands, data:data });
});

router.get('/command/:command', function(req, res) {

  if (req.params.command in bot_scripts){
    bot_scripts[req.params.command].execute(bot_data);
    res.redirect("/");
  }else{
    res.redirect("/");
  }

});

router.post('/login', validation.login_validation);


module.exports = router;
