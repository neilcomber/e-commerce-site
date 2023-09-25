const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth.js');
const adminProductsRouter = require('./routes/admin/products.js');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts.js');
 

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['lkasjhdse33dwhk756']
}));
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
    console.log('Listening');
})