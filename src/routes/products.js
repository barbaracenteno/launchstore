const express = require('express')
const routes = express.Router()

const multer = require('../app/middleware/multer')  

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')

const { onlyUsers } = require('../app/middleware/session')

//Search
routes.get('/products/search', SearchController.index)

//Products
routes.get('/create', onlyUsers, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', onlyUsers, ProductController.edit)

routes.post('/', onlyUsers, multer.array("photos", 8), ProductController.post)
routes.put('/', onlyUsers, multer.array("photos", 8), ProductController.put)
routes.delete('/', onlyUsers, ProductController.delete)


module.exports = routes
