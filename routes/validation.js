const { body,validationResult } = require('express-validator');
const fs = require('fs');
const { config } = require('process');

exports.login_validation =  [

  body('username', 'Bot Username required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password required').trim().isLength({ min: 1 }).escape(),
  body('channel', 'Your Channel name required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var data = req.body
    if (!errors.isEmpty()) {
        res.render('login', { title: 'Login', data:data , errors: errors.array()});
        return;
    }else{
        var config = {
            "username": data.username,
            "password": data.password,
            "channels":[data.channel],
            "blacklist": ["moobot", "streamelements"],
            "message_sound": "sword.mp3",
            "volume": 0.7
        }
        console.log(config)
        let conf = JSON.stringify(config);
        fs.writeFileSync('./config/default.json', conf, { flag: 'w' });
        function redirect(res){res.redirect("/");}
        setTimeout(redirect(res), 3000);
        
    }
  }
]