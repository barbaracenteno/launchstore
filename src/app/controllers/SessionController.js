const User = require('../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if (!products) return res.send("Produtos não encontrados!")

        async function getImage(productId) {
            let results = await Product.files(productId)
            const files = results.rows.map(file =>`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const productsPromise = products.map(async product => {
            product.img = await getImage(product.id)
            product.price = formatPrice(product.price)
            product.oldPrice = formatPrice(product.old_price)
            return product
        }).filter((_, index) => index > 2 ? false : true)

        const lastAdded = await Promise.all(productsPromise)

        return res.render("home/index", { products: lastAdded })
    },
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id
        
        return res.redirect("/users")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    }, 
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    async forgot(req, res) {
        const user = req.user
        try {
            //token para usuário
            const token = crypto.randomBytes(20).toString("hex")

            //criar expiração do token
            let now = new Date()
            now =  now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
            //enviar email com link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: "Recuperação de senha",
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe! Clique no link abaixo para recuperar sua senha.</p>
                <p> 
                    <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a> 
                </p>
                `
            })
            //avisar o usuario que enviamos o email
                return res.render("session/forgot-password", {
                    success: "Verifique seu e-mail para recuperar a senha!"
                })

        }catch(err) {
            console.error(err)
            return res.render("session/forgot-password", {
                error: "Ocorreu um erro. Tente novamente!"
            })
        }
    },
    resetForm(req, res){
        return res.render("session/password-reset", { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { password } = req.body

        try {
            
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""

            })

            return res.render("session/login", {
                user: req.body,
                success: "Senha alterada com sucesso!"
            })

        }catch(err) {
            console.error(err)
            return res.render("session/password-reset", {
                user: req.body,
                error: "Ocorreu um erro. Tente novamente!"
            })
        }
    }
}


        
