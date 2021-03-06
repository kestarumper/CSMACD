var Packet = require('./Packet');
var NetworkNode = require('./NetworkNode');

function range(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var waitBeforeSendMin = 1500;
var waitBeforeSendMax = 3000;
var waitingTimeAfterCollisionMin = 10000;
var waitingTimeAfterCollisionMax = 20000;

var GLOBAL_SENT = document.getElementById('sent');
var GLOBAL_REACHED = document.getElementById('reached');
var GLOBAL_STATS = document.getElementById('stats');

function increaseSENT() {
    GLOBAL_SENT.innerText = parseInt(GLOBAL_SENT.innerText) + 1;
    updateStatistic()
}

function increaseREACHED() {
    GLOBAL_REACHED.innerText = parseInt(GLOBAL_REACHED.innerText) + 1;
    updateStatistic()
}

function updateStatistic() {
    GLOBAL_STATS.innerText = (parseFloat(GLOBAL_REACHED.innerText) / parseFloat(GLOBAL_SENT.innerText) * 100).toFixed(2) + '%';
}

class Computer extends NetworkNode {
    constructor(htmlNode, label) {
        super(htmlNode);
        this.label = label;
        this.simulationTimer = this.simulate(waitBeforeSendMin, waitBeforeSendMax);
        this.destinations = [];
        this.mailbox = [];
        this.waitingTimer = null;
    }

    addDestination(host) {
        this.destinations.push(host);
    }

    getRandomDestination() {
        return this.destinations[Math.floor(Math.random() * this.destinations.length)];
    }

    getPacketId() {
        return parseInt(GLOBAL_SENT.innerText);
    }

    simulate(min, max) {
        var timeout = range(min, max);
        var wasSent = false;
        return setTimeout(() => {
            var dest = this.getRandomDestination();
            var packetId = this.getPacketId();
            if (this.interfaces[0] !== null) {
                if (this.interfaces[0].data == null) {
                    this.send(0, new Packet(this.label, this, dest, packetId));
                    wasSent = true;
                }
            }
            if (this.interfaces[1] !== null) {
                if (this.interfaces[1].data == null) {
                    this.send(1, new Packet(this.label, this, dest, packetId));
                    wasSent = true;
                }
            }
            if (wasSent) {
                increaseSENT();
            }
            this.simulationTimer = this.simulate(min, max);
        }, timeout);
    }

    receive(packet, input) {
        if (packet.data == "###") {
            if(this.waitingTimer == null) {
                if (this.htmlNode != null) {
                    this.htmlNode.setAttribute('disabled', 'true');
                }
    
                clearTimeout(this.simulationTimer);
                var timeout = range(waitingTimeAfterCollisionMin, waitingTimeAfterCollisionMax);
    
                this.waitingTimer = setTimeout(() => {
                    if (this.htmlNode != null) {
                        this.htmlNode.setAttribute('disabled', 'false');
                    }
                    this.waitingTimer = null;
                    this.simulationTimer = this.simulate(waitBeforeSendMin, waitBeforeSendMax);
                }, timeout);
            }
        } else {
            if (packet.from === this) {
                console.log("Packet returned to sending host.");
            } if (packet.to === this) {
                var index = this.mailbox.findIndex(function(v, i, a) {
                    return v.id == packet.id;
                });
                if (index < 0) {
                    increaseREACHED();
                    this.mailbox.push(packet);
                } else {
                    this.mailbox = this.mailbox.splice(index, 1);
                    console.error("DUPLICATE");
                }

                console.log("Packet reached desired host.");
            } else {
                super.receive(packet, input);
            }
        }
    }
}

module.exports = Computer;