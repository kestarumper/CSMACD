var Packet = require('./Packet');
var NetworkNode = require('./NetworkNode');

function range(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class Computer extends NetworkNode {
    constructor(htmlNode, label) {
        super(htmlNode);
        this.label = label;
        this.sendingTimer = this.simulate(2500, 5000);
        this.droppingPackets = 0;
    }

    simulate(min, max) {
        var timeout = range(min, max);
        return setTimeout(() => {
            var randomInterface = range(0, 100) > 50 ? 1 : 0;
            if(this.interfaces[randomInterface] !== null) {
                if(this.interfaces[randomInterface].data == null) {
                    this.send(randomInterface, new Packet(this.label, this));
                }
            }
            this.sendingTimer = this.simulate(min, max);
        }, timeout);
    }
    
    receive(packet, input) {
        if(this.droppingPackets == false) {
            if(packet.data == "###") {
                this.htmlNode.setAttribute('disabled', 'true');
                this.droppingPackets = true;
                clearTimeout(this.sendingTimer);
                var timeout = range(5000, 7000);
                console.log(`Detected collision, stopping for ${timeout/1000}s`);
                setTimeout(() => {
                    this.htmlNode.setAttribute('disabled', 'false');
                    this.droppingPackets = false;
                    this.sendingTimer = this.simulate(2000, 4000);
                }, timeout);
            } else {
                if(packet.from === this) {
                    console.log("Packet returned to sending host");
                } else {
                    super.receive(packet, input);
                }
            }
        } 
    }
}

module.exports = Computer;