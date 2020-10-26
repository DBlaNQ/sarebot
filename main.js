const discord = require('discord.js')
const ytdl = require('ytdl-core-discord');
const trev = require('trev');
const { YTSearcher } = require('ytsearcher');

client = new discord.Client();
searcher = new YTSearcher({
    key: process.env.YTAPI,
    revealed: true
});

client.on('ready', () => {
    console.log("Online sum be Arsenal!")
})

const queue = new Map();
const prefix = '-';

client.on('message', async(message) =>{
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return
    }

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const serverQueue = queue.get(message.guild.id)

    switch (command){
        //Bruh
        case 'me':
            message.channel.send("Zdravo! Jas sum Sare Andreevski, Imam 10 godini i najubav fudbalerski tim mi e Arsenal!");
            break;
        case 'help':
            const helpMsg = new discord.MessageEmbed()
                .setTitle("Help commands | Prefix is ('-')")
                .setFooter("Kiko#4288")
                .setColor([69, 196, 255])
                .addField("Bruh Commands", "me, help")
                .addField("Fun Commands", "rate")
                .addField("Music Commands", "play, skip, leave")
            message.channel.send(helpMsg);
            break;
        //FUN COMMANDS
        case 'rate':
            let choek = message.content.split(" ")
            message.channel.send(`I give ${choek[1]} a ${Math.floor(Math.random() * 10)}/10`)
            break;
        //MUSIC COMMANDS
        case 'play':
            if(args.length === 0) return message.channel.send("Dobro be glupav si da neznajs da napishish -play <video nekoe tuka>? Weirdchamp")
            execute(message, serverQueue)
            break;
        case 'skip':
            skip(message, serverQueue)
            break;
        case 'leave':
            stop(message, serverQueue);
            break;

        //NSFW
        case 'ass':
            if(!message.channel.nsfw) return message.channel.send("This channel is not NSFW.")
            assp(message.channel);
            break;
    }
    //EPIC COMMANDS
    switch(message.content){
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

    async function execute(message, serverQueue){
        let vc = message.member.voice.channel;
            if(vc){
                let result = await searcher.search(args.join(" "), { type: 'video' });
                const songInfo = await ytdl.getInfo(result.first.url)
                
                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
                };

                if(!serverQueue){
                    const queueConstruct = {
                        txtChannel: message.channel,
                        vChannel: vc,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true
                    };
                    queue.set(message.guild.id, queueConstruct);
                        
                    queueConstruct.songs.push(song);

                    try{
                        let connection = await vc.join();
                        queueConstruct.connection = connection;
                        play(message.guild, queueConstruct.songs[0]);
                    }catch (err){
                        console.error(`Epic error occured ${err}`);
                        queue.delete(message.guild.id);
                        return message.channel.send(err);
                    }
                }else{
                    serverQueue.songs.push(song);
                    return message.channel.send(`${song.url} has been added to the queue`);
                }
            }else{
                return message.channel.send("You are not in any voice channels to use this command")
            }
    }

    //MUSIC FUNCTIONS
    function skip (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to use this command")
        if(!serverQueue)
            return message.channel.send("There is no song to skip");
        serverQueue.connection.dispatcher.end();    
    }

    function stop(message, serverQueue) {
        if(!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to use this command")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

    function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;
        }
        try{
            const dispatcher = serverQueue.connection
                .playOpusStream(await ytdl(song.url))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.txtChannel.send(`Now playing ${song.url}`);
        }catch(err){
            console.log(`There was an error ${err}`)
        }
    }

    //NSFW FUNCTIONS
    async function assp(channel){
        let assPic = await trev.nsfw.ass();
        channel.send(assPic.media);
    }
})
client.login(process.env.TOKEN)