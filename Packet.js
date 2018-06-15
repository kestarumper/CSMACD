class Packet {
    constructor(data, from = null, to = null) {
        this.data = data;
        this.from = from;
        this.to = to;
    }

    toString() {
        return this.data;
    }
}

module.exports = Packet;