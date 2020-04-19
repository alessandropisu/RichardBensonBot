const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Discord.Client();
const constants = require("./constants");
const volume = constants.DEFAULT_VOLUME;
require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
    const [baseCommand, launchedCommand] = msg.content.split(" ");

    if (baseCommand === constants.COMMAND) {
        const voiceChannel = msg.member.voice.channel;

        function playAudio(connection, audio) {
            const dispatcher = connection.play(path.join("./audio", audio), {
                volume,
            });
            dispatcher.on("finish", (end) => {
                voiceChannel.leave();
            });
        }

        if (launchedCommand) {
            switch (launchedCommand) {
                case constants.HELP: {
                    msg.channel.send(constants.HELP_MESSAGE);
                    break;
                }
                default:
                    msg.channel.send(constants.DEFAULT_MESSAGE);
            }
        } else {
            voiceChannel.join().then((connection) => {
                fs.readdir("./audio", (err, audios) => {
                    if (err) return;

                    const randomAudio =
                        audios[Math.floor(Math.random() * audios.length)];

                    playAudio(connection, randomAudio);
                });
            });
        }
    }
});

client.login(process.env.BOT_TOKEN);
