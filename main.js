const etherDOM = document.querySelector('#ether');
const computersDOM = document.querySelector('#computers');
const cableDOM = document.querySelector('#cable');
const CABLE_LENGTH = 32;
const COMPUTER_NUMBER = 8;
// const COLORS = ['#E00', '#0D0', '#00C', '#FC0', '#F0F', '#ACE', '#0AE', '#FA0'];
const WAIT_INTERVAL_LOW = 10;
const WAIT_INTERVAL_HIGH = 200;
const RETRY_INTERVAL_LOW = 10;
const RETRY_INTERVAL_HIGH = 50;
var CLOCK = 50;

// const labelClk = document.querySelector('#labelclk');
// const rangeClk = document.querySelector('#clk');
// rangeClk.addEventListener('change', () => {
//     CLOCK = parseInt(rangeClk.value);
//     labelClk.innerHTML = CLOCK+'ms';
// });

function generateColors(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    var result = [];
    var tmp = '';
    for(var i = 0; i < n; i += 1) {
        tmp = '#';
        for(var j = 0; j < 3; j += 1) {
            tmp += chars[Math.floor(Math.random()*16)]; 
        }
        result.push(tmp);
    }
    return result;
}

const COLORS = generateColors(COMPUTER_NUMBER);

class Cell {
    constructor(id, domobj) {
        this.id = id;
        this.obj = domobj;
        this.lifeTime = 0;
        this.propagating = false;
    }

    energyLoss() {
        this.lifeTime = this.lifeTime > 0 ? this.lifeTime - 1 : 0;
        if(this.lifeTime == 0) {
            this.obj.innerText = '';
            this.obj.style.backgroundColor = '';
        }
    }

    send(char) {
        if(this.obj.innerHTML == '') {
            this.obj.innerHTML = char;
            this.lifeTime = CABLE_LENGTH;
        } else if(this.obj.innerHTML != char) {
            this.obj.innerHTML = 'ERR!';
            this.lifeTime = CABLE_LENGTH;
        }
        this.obj.style.backgroundColor = char;
    }
}

class Computer {
    constructor(id, color, cable) {
        this.id = id;
        this.color = color;
        this.cable = cable;
        this.obj = null;
        this.waiting = false;
        this.messages = [];
        this.sent = 0;
        this.messagesObj = document.createElement('pre');
        this.messagesObj.style.color = this.color;
        document.body.appendChild(this.messagesObj);
    }

    showMessages() {
        // if(this.messages.length == 10) {
        //     this.messages = this.messages.slice(5, this.messages.length);
        // }
        this.messagesObj.innerHTML = this.messages;
    }

    send(char) {
        if(this.etherEmpty()) {
            this.sent += 1;
            char = char || this.color;
            this.cable[this.id].propagating = true;
            this.cable[this.id].send(char);
        } else {
            this.obj.setAttribute('waiting', 'true');
            waitThenSend(RETRY_INTERVAL_LOW, RETRY_INTERVAL_HIGH, this);
        }
    }

    receive() {
        var mailbox = this.cable[this.id];
        if(mailbox.propagating == true && mailbox.obj.innerText != this.color) {
            this.messages.push(mailbox.obj.innerText);
            this.showMessages();
        }
    }

    etherEmpty() {
        return this.cable[this.id].obj.innerText == '';
    }
}

function generateCable(len) {
    var result = [];
    var td = null;
    var cell = null;
    for(var i = 0; i < CABLE_LENGTH; i++) {
        td = document.createElement('td');
        td.innerHTML = '';
        cell = new Cell(i, td);
        result.push(cell);
    }
    return result;
}

function drawCable(arr, objcable, objcomputers) {
    var th = null;
    for(var elt of arr) {
        th = document.createElement('th');
        th.setAttribute('computer', elt.id+'');
        objcomputers.appendChild(th);
        objcable.appendChild(elt.obj);
    }
}

function appendComputer(pc, obj) {
    for(var th of obj.children) {
        // debugger
        if(th.attributes.computer.value == pc.id) {
            pc.obj = th;
            pc.obj.innerHTML = '💻';
            pc.obj.style.color = pc.color;
        }
    }
}

function computersListen(arr) {
    for(var pc of arr) {
        pc.receive();
    }
}

function propagate(cells) {
    var propagatingCells = [];
    
    for(var cell of cells) {
        if(cell.propagating == true) {
            propagatingCells.push(cell);
        }
        cell.energyLoss();
    }

    var next = null;
    var prev = null;
    for(var cell of propagatingCells) {
        next = cells[cell.id + 1];
        prev = cells[cell.id - 1];
        if(next !== undefined && next.obj.innerText != cell.obj.innerText) {
            next.send(cell.obj.innerText);
            next.propagating = true;
        }
        if(prev !== undefined && prev.obj.innerText != cell.obj.innerText) {
            prev.send(cell.obj.innerText);
            prev.propagating = true;
        }
        cell.propagating = false;
    }
}

function waitThenSend(low, high, pc) {
    if(pc.waiting == false) {
        pc.waiting = true;
        var randomTimeout = (Math.random()*(high - low) + low)*CLOCK;
        setTimeout(function() {
            pc.waiting = false;
            pc.obj.setAttribute('waiting', 'false');
            pc.send();
        }, randomTimeout);
    }
}

function randomComputerSends(arr, chance) {
    var willSend = Math.random() < chance;
    if(willSend) {
        var randComputer = Math.floor(Math.random()*arr.length);
        waitThenSend(WAIT_INTERVAL_LOW, WAIT_INTERVAL_HIGH, arr[randComputer]);
    }
}

const cable = generateCable(CABLE_LENGTH);
drawCable(cable, cableDOM, computersDOM);

const computers = [];
for(var i = 0; i < COMPUTER_NUMBER; i++) {
    computers.push(new Computer(i*Math.floor(CABLE_LENGTH / COMPUTER_NUMBER), COLORS[i], cable));
    appendComputer(computers[i], computersDOM);
}

setInterval(function() {
    computersListen(computers);
    randomComputerSends(computers, 0.1);
    propagate(cable);
}, CLOCK);