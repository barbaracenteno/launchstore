const db = require('../../config/db')
const { all } = require('../../routes')

module.exports = {
    all() {
        return db.query(`
        SELECT * FROM categories
        
        `)
    }
}
