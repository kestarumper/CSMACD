var Packet = require('./Packet');
var NetworkNode = require('./NetworkNode');

var GLOBAL_INQUEUE = document.getElementById('inqueue');

function increaseINQEUE() {
    GLOBAL_INQUEUE.innerText = parseInt(GLOBAL_INQUEUE.innerText) + 1;
}
function decreaseINQEUE() {
    GLOBAL_INQUEUE.innerText = parseInt(GLOBAL_INQUEUE.innerText) - 1;
}

class Server extends NetworkNode {
    constructor(processTime = 500) {
        super(null);
        this.label = "Server";
        this.interfaces = {};
        this.processTime = processTime;

        this.logicalInterfaces = {};
    }

    join(node, id) {
        super.join(node, id);
        this.logicalInterfaces[id] = {
            queue: [],
            timer: null,
            out: this.interfaces[id],
        }
    }

    receive(data, input) {
        
        if(data.data != "###") {
            console.log(`Received '${data.data}' from ${data.from.label}`);

            var ifc = this.logicalInterfaces[data.from.label];
            ifc.queue.push(data); // dodanie pakietu do kolejki na porcie wychodzącym
            increaseINQEUE();
    
            if(ifc.timer == null) {
                // ustawienie demona który będzie wypluwał pakiety które otrzymał na danym interfejsie
                // do odpowiednich interfejsów wychodzacych
                ifc.timer = setInterval(() => {
                    // Ta pętla wywołuje się co "this.processTime" milisekund
                    // Sprawdzam czy łącze jest puste
                    if(ifc.out.data == null) {
                        var packet = ifc.queue.shift();
                        decreaseINQEUE();
                        var recipient = packet.to;
                        // wyslij pakiet na logicznym porcie
                        // ktory prowadzi do komputera koncowego
                        this.send(recipient.label, packet);
        
                        if(ifc.queue.length < 1) {
                            // jesli nie ma juz pakietow do wyslania, zabij demona
                            clearInterval(ifc.timer);
                            ifc.timer = null;
                        }
                    }
                }, this.processTime);
            }
        } else {
            console.error("Server detected collision");
        }
        

    }
}

module.exports = Server;