var Packet = require('./Packet');
var Cable = require('./Cable');
var Computer = require('./Computer');
var Server = require('./Server');

var topology = document.getElementById('topology');

var server = new Server();
function generateStar(target, computersNum, cableLength) {
    var computers = [];
    var node;
    var tmpCable;
    var cableNode;
    for (let i = 0; i < computersNum; i += 1) {
        node = new Computer(null, `PC${i}`);
        tmpCable = [];
        for (let j = 0; j < cableLength; j += 1) {
            cableNode = new Cable(null);
            tmpCable.push(cableNode);
        }

        node.join(tmpCable[0], 0);
        tmpCable[0].join(node, 1);
        for (let j = 0; j < cableLength - 1; j += 1) {
            tmpCable[j].join(tmpCable[j + 1], 0);
            tmpCable[j + 1].join(tmpCable[j], 1);
        }
        tmpCable[tmpCable.length - 1].join(server, 0);
        server.join(tmpCable[tmpCable.length - 1], node.label);

        computers.push(node);
    }

    for (const me of computers) {
        for (const node of computers) {
            if (node !== me) {
                me.addDestination(node);
            }
        }
    }
}

var numComputers = prompt("Ile komputerów?", 4);
var numCable = prompt("Jaka długość kabla?", 4);
generateStar(topology, numComputers, numCable);
console.log(server);