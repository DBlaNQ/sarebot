module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
        return message.channel.send("There is no music currently playing!");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("You are not in the voice channel!");

    let usersC = message.member.voice.channel.members.size;
    let required = Math.ceil(usersC/2);

    if(serverQueue.skipVotes.includes(message.member.id))
        return message.channel.send("You already voted to skip!")

    serverQueue.skipVotes.push(message.member.id)
    message.channel.send(`You voted to skip the song ${serverQueue.skipVotes.length}/${required} votes`)

    if(serverQueue.skipVotes.length >= required){
        serverQueue.connection.dispatcher.end();
        serverQueue.skipVotes = [];
        message.channel.send("Song has been skipped")
    }
}

module.exports.config = {
    name: "skip",
    aliases: ["s", "sk"]
}