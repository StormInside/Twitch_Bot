module.exports = {
    execute: function (data){
        client = data["client"]
        target = data["target"]
        context = data["context"]
        console.log(context)
        client.say(target, `Sosi, ${context.username} !!!`);
    },

    reset: function (){
        return 0
    }
}