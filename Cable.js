var NetworkNode = require('./NetworkNode');

class Cable extends NetworkNode {
    /**
     * 
     * @param {Int} lifetime 
     */
    constructor(htmlNode, lifetime) {
        super(htmlNode, lifetime);        
    }
}

module.exports = Cable;