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
    }

    addDestination(host) {
        this.destinations.push(host);
    }

    getRandomDestination() {
        return this.destinations[Math.floor(Math.random()*this.destinations.length)];
    }

    simulate(min, max) {
        var timeout = range(min, max);
        return setTimeout(() => {
            var randomInterface = range(0, 100) > 50 ? 1 : 0;
            if (this.interfaces[randomInterface] !== null) {
                if (this.interfaces[randomInterface].data == null) {
                    increaseSENT();
                    this.send(randomInterface, new Packet(this.label, this, this.getRandomDestination()));
                }
            }
            this.simulationTimer = this.simulate(min, max);
        }, timeout);
    }

    receive(packet, input) {
        if (packet.data == "###") {
            if(this.htmlNode != null) {
                this.htmlNode.setAttribute('disabled', 'true');
            }

            clearTimeout(this.simulationTimer);
            var timeout = range(waitingTimeAfterCollisionMin, waitingTimeAfterCollisionMax);

            setTimeout(() => {
                if(this.htmlNode != null) {
                    this.htmlNode.setAttribute('disabled', 'false');
                }
                this.simulationTimer = this.simulate(waitBeforeSendMin, waitBeforeSendMax);
            }, timeout);
        } else {
            if (packet.from === this) {
                console.log("Packet returned to sending host.");
            } if(packet.to === this) {
                increaseREACHED()
                console.log("Packet reached desired host.");
            } else {
                super.receive(packet, input);
            }
        }
    }
}

module.exports = Computer;