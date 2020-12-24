module.exports.run = (client, message, args, queue, searcher) => {
    message.channel.send(`Ping is being mesured...`).then(resultMessage => {
        const ping = resultMessage.createdTimestamp - message.createdTimestamp;

        resultMessage.edit(`Bot ping is: ${ping} | API ping is: ${client.ws.ping}`)
    })
}

module.exports.config = {
    name: "ping",
    aliases: ["p"]
}