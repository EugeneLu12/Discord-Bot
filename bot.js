const cheerio = require('cheerio');
const rp = require('request-promise'); 

const Discord = require('discord.js');
const bot = new Discord.Client();

let Filter = require('./filter.js');
let MuteUser = require('./mute_user');

let botconfig = require('./botconfig');

let fs = require('fs');

bot.login(botconfig.key);

let filter = new Filter(); 
let muteUser = new MuteUser();

bot.on('message', (message) => {
    
    if (message.content.startsWith("~")) {
        let cmdIndex = message.content.indexOf(" ");
        if(cmdIndex < 0) {
            cmdIndex = message.content.length;
        }
        let cmd = message.content.substring(1, cmdIndex);
        let args = message.content.substring(cmdIndex + 1, message.content.length);

        if (message.author.username == "asdfasdf") {
            message.channel.send("Sorry, I don't respond to confirmed hackers.");
        
        } else {
            switch(cmd) {
                case 'addFilter': 
                    filter.updateInputs(botconfig, message, args);
                    filter.addToFilter();
                    break;

                case 'removeFilter':
                    filter.updateInputs(botconfig, message, args);
                    filter.removeFromFilter();
                    break;

                case 'clearFilter':
                    filter.updateInputs(botconfig, message, args);
                    filter.clearFilter();
                    break;

                case 'showFilter':
                    filter.updateInputs(botconfig, message, args);
                    filter.showFilter()   
                    break;
                
                case 'mute':
                    muteUser.updateInputs(botconfig, message, args);
                    muteUser.addToMuteList(args);
                    break;   
                
                case 'removeMute':
                    muteUser.updateInputs(botconfig, message, args);
                    muteUser.removeFromMuteList();
                    break;

                case 'clearMute':
                    muteUser.updateInputs(botconfig, message, args);
                    muteUser.clearMuteList();
                    break;

                case 'showMute':
                    muteUser.updateInputs(botconfig, message, args);
                    muteUser.showMuteList();
                    break;
                
                case 'chino':
                    let index = Math.floor(Math.random() * 5);
                    message.channel.send(botconfig.chino[index]);
                    break;
            
                case 'mmr': 
                    const options = {
                        uri: 'http://sc2unmasked.com/Search?q=' + args,
                        transform: function (body) {
                            return cheerio.load(body);
                        }
                    };

                    rp(options)
                    .then(($) => {
                        let mmr = [];
                        let username = [];
                        $('tr[id^="MainContent"]').each(function() {
                            mmr.push(parseInt($(this).find('.align-right').html()));
                        }); 

                        $('a[href^="http://"][href*="battle.net/sc2/en/profile"]').each(function(i, elem) {
                            const usernameSubstring = String($(this).text());
                            const subIndex = usernameSubstring.indexOf('>');
                            if (subIndex > 0) {
                                username.push(usernameSubstring.substring(subIndex + 1, usernameSubstring.length));
                            } else {
                                username.push(usernameSubstring);
                            }
                        }); 

                        message.channel.send(mmr.length + " matches found!");
                        for (i = 0; i < mmr.length; i++) {
                            message.channel.send(username[i] + ": " + mmr[i]);
                        }
                        
                    })
                    .catch((err) => {
                        console.log(err);
                        message.channel.send("unable to retrieve mmr");
                    });
                    break;

                case 'help':
                    message.author.sendMessage("valid commands are: removeFilter, clearFilter, showFilter, addFilter, help, mmr [username].");
            }
        }
    } else if (message.author.username != 'YenFuBot') {
        filter.updateInputs(botconfig, message);
        shouldDeleteMessage(message, botconfig);
    }
});

function shouldDeleteMessage(message) {
    for (let i = 0; i < botconfig.mutelist.length; i ++ ) {
        if (message.author.username === botconfig.mutelist[i]) {
            message.delete();
            return;
        }
    }
    for (let i = 0; i < botconfig.filterlist.length; i ++) {
        if (message.content.toLowerCase().includes(botconfig.filterlist[i].toLowerCase())) {
            message.delete();
            return;
        }
    }
}
