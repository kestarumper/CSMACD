var Packet = require('./Packet');
var Cable = require('./Cable');
var Computer = require('./Computer');

var topology = document.getElementById('topology');

function generateCirce(target, computersNum, cableLength) {
    function rotate(point, angle) {
        var matrix = [
            Math.cos(angle), -Math.sin(angle),
            Math.sin(angle), Math.cos(angle)
        ];
        var x = matrix[0] * point.x + matrix[1] * point.y;
        var y = matrix[2] * point.x + matrix[3] * point.y;
        return {x, y};
    }

    var nodes = [];
    var node;
    var tmp;
    var centerX = target.clientWidth / 2;
    var centerY = target.clientHeight / 2;

    var angle = (2 * Math.PI) / (computersNum*cableLength);
    var radius = target.clientHeight / 4;
    var startingPoint = {x: radius, y: radius};

    var rotatedPoint;
    for(let i = 0; i < computersNum*cableLength; i += 1) {
        rotatedPoint = rotate(startingPoint, i * angle);
        rotatedPoint.x += centerX;
        rotatedPoint.y += centerY;
        
        tmp = document.createElement(i % cableLength == 0 ? 'computer' : 'cable');
        tmp.style.left = `${rotatedPoint.x}px`;
        tmp.style.top = `${rotatedPoint.y}px`;
        target.appendChild(tmp);
        
        node = i % cableLength == 0 ? new Computer(tmp, `PC${i}`) : new Cable(tmp);
        nodes.push(node);
    }

    for(let i = 0; i < nodes.length - 1; i += 1) {
        nodes[i].join(nodes[i+1], 0);
        nodes[i+1].join(nodes[i], 1);
    }
    nodes[nodes.length-1].join(nodes[0], 0);
    nodes[0].join(nodes[nodes.length-1], 1);

    for(const me of nodes) {
        if(me instanceof Computer) {
            for(const node of nodes) {
                if(node instanceof Computer && node !== me) {
                    me.addDestination(node);
                }
            }
        }
    }
}

var numComputers = prompt("Ile komputerów?", 8);
var numCable = prompt("Jaka długość kabla?", 8);
generateCirce(topology, numComputers, numCable);