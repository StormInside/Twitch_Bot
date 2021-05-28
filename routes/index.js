var express = require('express');
var router = express.Router();
var validation = require('./validation');

var CONFIG = require('config');

const bot = require("../bin/bot.js")
var bot_scripts = bot.bot_scripts
var bot_data = bot.bot_data

var scripts = []
for (key in bot_scripts){
  scripts.push(key)
}

/* GET home page. */
router.get('/', function(req, res, next) {

  if (!CONFIG.has("password")){
    res.redirect("/login");
  }

  res.render('index', {scripts: scripts});
});

router.get('/login', function(req, res, next){
  res.render('login', { title: 'Express' });
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

// for (var command in bot_scripts){
//   router.get('/'+command, function(req, res, next){
//     console.log(bot_scripts[command])
//     bot_scripts[command].execute(bot_data);
//     res.redirect("/");
//   })
// }

module.exports = router;
