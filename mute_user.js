let fs = require('fs');

class MuteUser {
    constructor(botconfig, message, args) {
        this.message = message;
        this.args = args;
        this.botconfig = botconfig;
    }

    updateInputs(botconfig, message, args) {
        this.message = message;
        this.args = args;
        this.botconfig = botconfig;
    }

    updateMuteList() {
        let json = JSON.stringify(this.botconfig);
        fs.writeFile("botconfig.json", json, 'utf8', function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

    isAlreadyMuted() {
        for(let i = 0; i < this.botconfig.mutelist.length; i ++) {
            if (this.args == this.botconfig.mutelist[i]) {
                return true;
            }
        }
        return false;
    }

    removeFromMuteList() {
        let index = this.botconfig.mutelist.indexOf(this.args);
        if (index > - 1) {
            this.botconfig.mutelist.splice(index, 1);
            this.message.channel.send("Successfully removed " + this.args + " from filter list!");
            this.updateMuteList();
        } else {
            this.message.channel.send("Unable to remove " + this.args + " from filter list!");
        }
    }

    addToMuteList() {
        if(!this.isAlreadyMuted() && this.args != "") {
            this.botconfig.mutelist.push(this.args);
            this.updateMuteList();
            this.message.channel.send("added " + this.args + " to muted list!");
        } else {
            this.message.channel.send(this.args + " is already in the muted list!");
        }
    }

    clearMuteList() {
        try {
            this.botconfig.mutelist = [];
            this.message.channel.send("Successfully cleared filter list!");
            this.updateMuteList();
        }
        catch(err) {
            message.channel.send("Unable to clear filter list!");
            console.log(err);
        }
    }

    showMuteList() {
        if (this.botconfig.mutelist.length > 0) {
            this.message.channel.send(this.botconfig.mutelist);
        } else {
            this.message.channel.send("muted users list is empty!");
        }
    }
};

module.exports = MuteUser;
