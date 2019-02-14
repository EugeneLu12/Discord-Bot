let fs = require('fs');

class Filter {
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

    updateFilterList() {
        let json = JSON.stringify(this.botconfig);
        fs.writeFile("botconfig.json", json, 'utf8', function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

    isAlreadyFiltered() {
        for(let i = 0; i < this.botconfig.filterlist.length; i ++) {
            if (this.args == this.botconfig.filterlist[i]) {
                return true;
            }
        }
        return false;
    }

    removeFromFilter() {
        let index = this.botconfig.filterlist.indexOf(this.args);
        if (index > - 1) {
            this.botconfig.filterlist.splice(index, 1);
            this.message.channel.send("Successfully removed " + this.args + " from filter list!");
            this.updateFilterList();
        } else {
            this.message.channel.send("Unable to remove " + this.args + " from filter list!");
        }
    }

    addToFilter() {
        if(!this.isAlreadyFiltered() && this.args != "") {
            this.botconfig.filterlist.push(this.args);
            this.updateFilterList();
            this.message.channel.send("added " + this.args + " to filter list!");
        } else {
            this.message.channel.send(this.args + " is already in the filter!");
        }
    }

    clearFilter() {
        try {
            this.botconfig.filterlist = [];
            this.message.channel.send("Successfully cleared filter list!");
            this.updateFilterList();
        }
        catch(err) {
            message.channel.send("Unable to clear filter list!");
            console.log(err);
        }
    }

    showFilter() {
        if (this.botconfig.filterlist.length > 0) {
            this.message.channel.send(this.botconfig.filterlist);
        } else {
            this.message.channel.send("filter is empty!");
        }
    }
};

module.exports = Filter;
