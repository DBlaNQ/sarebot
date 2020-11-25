const discord = require('discord.js')
const ytdl = require('ytdl-core');
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
                execute(message, serverQueue);
                break;
            case 'stop':
                stop(message, serverQueue);
                break;
            case 'fskip':
                skip(message, serverQueue);
                break;
            case 'skip':
                vSkip(serverQueue);
                break;
            case 'pause':
                pause(serverQueue);
                break;
            case 'resume':
                resume(serverQueue);
                break;
            case 'loop':
                Loop(args, serverQueue);
                break;
            case 'queue':
                Queue(serverQueue);
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
        if(args.length <= 0)
            return message.channel.send("Please write the name of the song")

        let vc = message.member.voice.channel;
        if(!vc){
            return message.channel.send("Please join a voice chat first");
        }else{
            let result = await searcher.search(args.join(" "), { type: "video" }) 
            const songInfo = await ytdl.getInfo(result.first.url)

            let song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };

            if(!serverQueue){
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true,
                    loopone: false,
                    loopall: false,
                    skipVotes: []
                };
                queue.set(message.guild.id, queueConstructor);

                queueConstructor.songs.push(song);

                try{
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    message.guild.me.voice.setSelfDeaf(true);
                    play(message.guild, queueConstructor.songs[0]);
                }catch (err){
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(`Unable to join the voice chat ${err}`)
                }
            }else{
                serverQueue.songs.push(song);
                let msg = new Discord.MessageEmbed()
                    .setTitle("Song has been added")
                    .addField("", song.title)

                return message.channel.send(`The song has been added ${song.url}`);
            }
        }
    }
    function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () =>{
                if(serverQueue.loopone){  
                    play(guild, serverQueue.songs[0]);
                }
                else if(serverQueue.loopall){
                    serverQueue.songs.push(serverQueue.songs[0])
                    serverQueue.songs.shift()
                }else{
                    serverQueue.songs.shift()
                }
                play(guild, serverQueue.songs[0]);
            })

            let msg = new Discord.MessageEmbed()
                    .setTitle("Now Playing:")
                    .addField("------------------------", serverQueue.songs[0].title)
                    .setColor("BLUE")
            serverQueue.txtChannel.send(msg)
            
    }
    function stop (message, serverQueue){
        if(!serverQueue)
            return message.channel.send("There is no music playing!")
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You need to join the voice chat first!")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
    function skip (message, serverQueue){
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You need to join the voice chat first");
        if(!serverQueue)
            return message.channel.send("There is nothing to skip!");

        let roleN = message.guild.roles.cache.find(role => role.name === "DJ")

        if(!message.member.roles.cache.get(roleN.id))
            return message.channel.send("You don't have the DJ role");

        serverQueue.connection.dispatcher.end();
        serverQueue.skipVotes = [];
    }

    function vSkip(serverQueue){
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

    function pause(serverQueue){
        if(!serverQueue)
            return message.channel.send("There is no music currently playing!");
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You are not in the voice channel!")
        if(serverQueue.connection.dispatcher.paused)
            return message.channel.send("The song is already paused");
        serverQueue.connection.dispatcher.pause();
        message.channel.send("The song has been paused!");
    }
    function resume(serverQueue){
        if(!serverQueue)
            return message.channel.send("There is no music currently playing!");
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You are not in the voice channel!")
        if(serverQueue.connection.dispatcher.resumed)
            return message.channel.send("The song is already playing!");
        serverQueue.connection.dispatcher.resume();
        message.channel.send("The song has been resumed!");
    }
    function Loop(args, serverQueue){
        if(!serverQueue)
            return message.channel.send("There is no music currently playing!");
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You are not in the voice channel!")

        switch(args[0].toLowerCase()){
           case 'all':
               serverQueue.loopall = !serverQueue.loopall;
               serverQueue.loopone = false;

               if(serverQueue.loopall === true)
                   message.channel.send("Loop all has been turned on!");
               else
                    message.channel.send("Loop all has been truned off!");

               break;
            case 'one':
                serverQueue.loopone = !serverQueue.loopone;
                serverQueue.loopall = false;

                if(serverQueue.loopone === true)
                    message.channel.send("Loop one has been turned on!");
                else
                    message.channel.send("Loop one has been truned off!");
                break;
            case 'off':
                    serverQueue.loopall = false;
                    serverQueue.loopone = false;

                    message.channel.send("Loop has been turned off!");
                break;
            default:
                message.channel.send("Please specify what loop you want. !loop <one/all/off>"); 
        }
    }
    function Queue(serverQueue){
        if(!serverQueue)
            return message.channel.send("There is no music currently playing!");
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You are not in the voice channel!")

        let nowPlaying = serverQueue.songs[0];
        let qMsg =  `Now playing: ${nowPlaying.title}\n--------------------------\n`

        for(var i = 1; i < serverQueue.songs.length; i++){
            qMsg += `${i}. ${serverQueue.songs[i].title}\n`
        }

        message.channel.send('```' + qMsg + 'Requested by: ' + message.author.username + '```');
    }

    //NSFW FUNCTIONS
    async function assp(channel){
        let assPic = await trev.nsfw.ass();
        channel.send(assPic.media);
    }
})
client.login(process.env.TOKEN)