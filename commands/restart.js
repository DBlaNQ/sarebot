module.exports.run = async (client, message, args, queue, searcher) => {
    if (message.author.id === "298139826887327744"){
        channel.send('Resetting...')
        .then(msg => client.destroy())
        .then(() => client.login(process.env.TOKEN));
    }
}

module.exports.config = {
    name: "restart",
    aliases: ["rs"]
}