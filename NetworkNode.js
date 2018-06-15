var Packet = require('./Packet');

var CONNECTION_SPEED = 50;

class NetworkNode {

    /**
     * 
     * @param {HTMLObjectElement} htmlNode 
     */
    constructor(htmlNode = null, lifetime = 2*CONNECTION_SPEED) {
        this.interfaces = {
            0: null,
            1: null
        };
        this.data = null;
        this.htmlNode = htmlNode;


        this.lifetime = lifetime;
        this.timer = null;
        this.sendTimer = [null, null];
    }

    updateHTML() {
        if(this.htmlNode != null) {
            this.htmlNode.innerHTML = this.data;
        }
    }

    /**
     * 
     * @param {*} data 
     * @param {NetworkNode} input 
     */
    receive(packet, input) {
        if(this.data != null) {
            packet.from = null;
            packet.to = null;
            packet.data = "###";
        }
        
        this.data = packet;
        this.updateHTML();

        
        if(this.interfaces[0] === input) {
            this.send(1, packet);
        } else if(this.interfaces[1] === input) {
            this.send(0, packet);
        } else {
            console.error(input);
            throw new Error("Received packet from not directly connected node");
        }

        if(this.timer !== null) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.data = null;
            this.timer = null;
            this.updateHTML();
        }, this.lifetime);
    }

    /**
     * @param {*} data
     * @param {*} recipient 
     */
    send(recipient, packet) {
        clearTimeout(this.sendTimer[recipient]);
        this.sendTimer[recipient] = setTimeout(() => {
            this.interfaces[recipient].receive(packet, this);
        }, CONNECTION_SPEED)
    }

    /**
     * 
     * @param {NetworkNode} Cable 
     * @param {String} id 
     */
    join(node, id = 0) {
        this.interfaces[id] = node;
    }
}

module.exports = NetworkNode;