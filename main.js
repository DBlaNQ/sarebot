const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const { measureMemory } = require('vm');
const ytdl = require('ytdl-core');
const fs = require('fs')

const { YTSearcher } = require('ytsearcher');

searcher = new YTSearcher({
    key: process.env.YTAPI,
    revealed: true
});


const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on('ready', () => {
    console.log("Online sum be Arsenal!")
})

fs.readdir("./commands/", (e, f) => {
    if(e) return console.error(e);
    f.forEach(file => {
        if(!file.endsWith(".js")) return
        console.log(`${file} has been loaded`)
        let cmd = require(`./commands/${file}`);
        let cmdName = cmd.config.name;
        client.commands.set(cmdName, cmd)
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
        })
    })
})
const queue = new Map();
const prefix = '!';

client.on('message', async(message) =>{

    switch(message.content.toLowerCase()){
        case 'pog':
        case "poggers":
            message.channel.send(" ", {files: ["img/pogger.png"]})
            break;
        case 'th':
        case "trihard":
            message.channel.send(" ", {files: ["https://www.streamscheme.com/wp-content/uploads/2020/04/TriHard.png"]})
            break;
        case 'mac':
        case 'macmiller':
            message.channel.send(" ", {files: ["img/mac.jpg"]})
            break;
        case 'petar':
            message.channel.send(" ", {files: ["img/petar.jpg"]})
            break;
        case 'ivo':
            message.channel.send(" ", {files: ["img/ivo.jpg"]})
            break
        case 'daved':
        case 'dado':
        case 'david':
            message.channel.send(" ", {files: ["img/dado.png"]})
            break;
        case 'kiko':
        case 'miz':
        case 'mizh':
            message.channel.send(" ", {files: ["img/kiko.png"]})
            break;
    }


    if (!message.content.startsWith(prefix) || message.author.bot) {
        return
    }

    if(!message.content.startsWith(prefix)) return
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return

    try {
        cmd.run(client, message, args, queue, searcher);
    }catch (err){
        return console.error(err)
    }
    
    //NSFW FUNCTIONS
    async function assp(channel){
        let assPic = await trev.nsfw.ass();
        channel.send(assPic.media);
    }
})
client.login(process.env.TOKEN)