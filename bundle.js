(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var NetworkNode = require('./NetworkNode');

class Cable extends NetworkNode {
    /**
     * 
     * @param {Int} lifetime 
     */
    constructor(htmlNode, lifetime = 1000) {
        super(htmlNode);

        this.lifetime = lifetime;

        // A ========= B
        this.interfaces = {
            0: null,
            1: null
        };

        this.timer = null;
    }

    receive(data, input) {
        super.receive(data, input);

        if(this.timer !== null) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            console.log(`Clearing data ${this.data}`);
            this.data = null;
            this.timer = null;
            this.updateHTML();
        }, this.lifetime);
    }
}

module.exports = Cable;
},{"./NetworkNode":2}],2:[function(require,module,exports){
var Packet = require('./Packet');

var ID_COUNTER = 0;

class NetworkNode {

    /**
     * 
     * @param {HTMLObjectElement} htmlNode 
     */
    constructor(htmlNode = null) {
        this.interfaces = {};
        this.data = null;
        this.htmlNode = htmlNode;
    }

    updateHTML() {
        this.htmlNode.innerHTML = this.data;
    }

    /**
     * 
     * @param {*} data 
     * @param {NetworkNode} input 
     */
    receive(data, input) {
        if(this.data == null) {
            this.data = data;
        } else {
            this.data = `ERR{${this.data^data}}`;
        }
        this.updateHTML();
    }

    /**
     * @param {*} data
     * @param {NetworkNode} recipient 
     */
    send(recipient, data) {
        this.interfaces[recipient].receive(data, this);
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
},{"./Packet":3}],3:[function(require,module,exports){
class Packet {
    constructor(data, from, to) {
        this.data = data;
        this.from = from;
        this.to = to;
    }

    toString() {
        return this.data;
    }
}

module.exports = Packet;
},{}],4:[function(require,module,exports){
var Packet = require('./Packet');
var Cable = require('./Cable');

var c1 = new Cable(document.getElementById('cable1'));
var c2 = new Cable(document.getElementById('cable2'));

var topology = document.getElementById('topology');

function generateCirce(target, computersNum, cableLength) {
    var nodes = [];
    var tmpCable;
    var centerX = target.clientWidth / 2;
    var centerY = target.clientHeight / 2;

    for(let i = 0; i < computersNum*cableLength; i += 1) {
        tmpCable = document.createElement('span');
        tmpCable.style.
        topology.appendChild(tmpCable);
        nodes.push(new Cable(tmpCable))
    }
}

generateCirce(topology, 5, 3);
},{"./Cable":1,"./Packet":3}]},{},[4]);
