var Packet = require('./Packet');

var CONNECTION_SPEED = 200;

class NetworkNode {

    /**
     * 
     * @param {HTMLObjectElement} htmlNode 
     */
    constructor(htmlNode = null, lifetime = CONNECTION_SPEED+100) {
        this.interfaces = {
            0: null,
            1: null
        };
        this.data = null;
        this.htmlNode = htmlNode;


        this.lifetime = lifetime;
        this.timer = null;
    }

    updateHTML() {
        this.htmlNode.innerHTML = this.data;
    }

    /**
     * 
     * @param {*} data 
     * @param {NetworkNode} input 
     */
    receive(packet, input) {
        if(this.data != null) {
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
    send(recipient, data) {
        setTimeout(() => {
            this.interfaces[recipient].receive(data, this);
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