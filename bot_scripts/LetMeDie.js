var counter = 1000;

module.exports = {
    execute: function (data){
        client = data["client"]
        target = data["target"]
        if (counter >= 0){
            client.say(target, `${ counter }-7?`);
            counter = counter-7;
        }
        else{
            counter = 1000;
            client.say(target, `${ counter }-7?`);
            counter = counter-7;
        }
    },

    reset: function (){
        counter = 1000;
    }
}