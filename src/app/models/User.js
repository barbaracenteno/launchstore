const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')
const Product = require('../models/Product')

module.exports = {
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key] [field]}'`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },
    async create(data) {

        try {
            const query = `
            INSERT INTO users (
                name,
                email,   
                password,
                cpf_cnpj,
                cep,
                address         
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `
            // hass of password
            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ""),
                data.cep.replace(/\D/g, ""),
                data.address,           
            ]

            const results = await db.query(query, values)

            return results.rows[0].id
        }catch(error) {
            console.error(err)
        }
        
    },
    async update(id, fields)  {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length){
                query = `${query}
                ${key} = '${fields[key]}',
                `
            }else {
                query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    },
    async delete(id) {
        let results = await Product.all()
        const products = results.rows

        const allFilesPromise = products.map(product => 
            Product.files(product.id))
        let promiseResults = await Promise.all(allFilesPromise)

        await db.query('DELETE FROM users WHERE id = $1', [id])

        promiseResults.map(results => {
            results.rows.map(file => fs.unlinkSync(file.path) )
        })     

    }
    
}
