module.exports.run = (client, message, args, queue, searcher) => {
    if(!message.member.hasPermission("ADMINISTRATOR") || !message.member.hasPermission("MANAGE_ROLES"))
        return message.channel.send("You don't have the permissions")
    
    let role = message.guild.roles.cache.find(role => role.name === "Helpful Person")
    let person = message.mentions.members.first();
    
    person.roles.add(role)
    message.channel.send(`Congratulations ${person} you are amazing!`);

}
module.exports.config = {
    name: "promote",
    aliases: ["pr", "promo"]
}