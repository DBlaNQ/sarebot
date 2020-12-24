
module.exports.run = (client, message, args, queue, searcher) => {

    if(args.length < 1)
        return message.channel.send("What role do you want to have?");
    
    switch(args[0].toLowerCase()){
        case 'javascript':
        case 'js':
            promo(message, args[0], "javascript");
            break;
        case 'python':
        case 'py':
            promo(message, args[0], "python");
            break;
        case 'gamer':
            promo(message, args[0], "gamer");
            break;

    }


}

function promo(message, args, rolename = ""){

    let role = message.guild.roles.cache.find(role => role.name === rolename)
    if (!role)
        return message.channel.send(`The role ${args[0]} is not a role`)
    if(message.member.roles.cache.get(role.id))
        return message.channel.send("You already have that role")

    message.member.roles.add(role);
    message.react("785179671041671168")
}

module.exports.config = {
    name: "selfpromote",
    aliases: ["sp", "selfp", "spromo"]
}