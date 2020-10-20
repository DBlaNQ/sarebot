const discord = require('discord.js')

client = new discord.Client();

client.on('ready', () => {
    console.log("Online sum be Arsenal!")
})

client.on('message', msg =>{
    if (msg.content == "-kick"){
        msg.guild.kick
    }
    if(msg.content == "-me"){
        msg.channel.send("Zdravo! Jas sum Sare Andreevski, Imam 10 godini i najubav fudbalerski tim mi e Arsenal!");
    }
    if(msg.content == 'pog' || msg.content == "poggers"){
        msg.channel.send(" ", {files: ["https://i0.wp.com/nerdschalk.com/wp-content/uploads/2020/08/pogger.png?resize=311%2C307&ssl=1"]})
    }
    if(msg.content == 'th' || msg.content == "trihard"){
        msg.channel.send(" ", {files: ["https://www.streamscheme.com/wp-content/uploads/2020/04/TriHard.png"]})
    }
    if(msg.content == 'mac' || msg.content == 'macmiller'){
        msg.channel.send(" ", {files: ["https://cdn.discordapp.com/attachments/765918107247443993/768136165798314062/avatars-000317096184-q0upfw-t500x500.jpg"]})
    }
    if(msg.content == 'petar'){
        msg.channel.send(" ", {files: ["https://cdn.discordapp.com/attachments/765918107247443993/768136882898337822/122243792_1080335655735319_4810909954261953407_n.jpg"]})
    }
    if(msg.content == 'ivo'){
        msg.channel.send(" ", {files: ["https://cdn.discordapp.com/attachments/765918107247443993/768137958427066452/2019-02-09_21.51.44.jpg"]})
    }
    if(msg.content == 'daved' || msg.content == 'dado' || msg.content == 'david'){
        msg.channel.send(" ", {files: ["https://cdn.discordapp.com/attachments/765918107247443993/768138873192054835/dado.PNG"]})
    }
})

client.login(process.env.TOKEN)