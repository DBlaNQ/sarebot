const discord = require('discord.js')

client = new discord.Client();

client.on('ready', () => {
    console.log("Online sum be Arsenal!")
})

client.on('message', msg =>{
    switch (msg.content){
        //Bruh
        case '-me':
            msg.channel.send("Zdravo! Jas sum Sare Andreevski, Imam 10 godini i najubav fudbalerski tim mi e Arsenal!");
            break;
        //ADMIN COMMANDS
        case '-kick':
            if(msg.member.hasPermission("kick_members") || msg.member.hasPermission("administrator")){
                msg.mentions[0].kick()
            }
            break;
        case '-rate':
            let choek = msg.content.split(" ")
            msg.channel.send(`I give ${choek[1]} a ${Math.floor(Math.random(10) + 1)}/10`)
            break;
        //EPIC COMMANDS
        case 'pog':
        case "poggers":
            msg.channel.send(" ", {files: ["img/pogger.png"]})
            break;
        case 'th':
        case "trihard":
            msg.channel.send(" ", {files: ["https://www.streamscheme.com/wp-content/uploads/2020/04/TriHard.png"]})
            break;
        case 'mac':
        case 'macmiller':
            msg.channel.send(" ", {files: ["img/mac.jpg"]})
            break;
        case 'petar':
            msg.channel.send(" ", {files: ["img/petar.jpg"]})
            break;
        case 'ivo':
            msg.channel.send(" ", {files: ["img/ivo.jpg"]})
            break
        case 'daved':
        case 'dado':
        case 'david':
            msg.channel.send(" ", {files: ["img/dado.png"]})
            break;
        case 'kiko':
        case 'miz':
        case 'mizh':
            msg.channel.send(" ", {files: ["img/kiko.png"]})
            break;
    }
})

client.login(process.env.TOKEN)