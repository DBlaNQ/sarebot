module.exports.run = async (client, message, args, queue, searcher) => {
    if (message.author.id === "298139826887327744"){
        message.channel.send("Yes");
        process.exit();
    }
}

module.exports.config = {
    name: "restart",
    aliases: ["rs"]
}