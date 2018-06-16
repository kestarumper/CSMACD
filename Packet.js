class Packet {
    constructor(data, from = null, to = null, id = null) {
        this.data = data;
        this.from = from;
        this.to = to;
        this.id = id;
    }

    toString() {
        return this.data;
    }
}

module.exports = Packet;