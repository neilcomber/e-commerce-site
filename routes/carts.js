const express = require('express');

const cartsRepo = require('../repositories/carts.js');
const productsRepo = require('../repositories/products.js');
const cartShowTemplate = require('../views/carts/show.js');

const router = express.Router();

//add to cart with post request
router.post('/cart/products', async (req, res)=> {
    let cart;

    // figure out the cart

    if (!req.session.cartId) {
        cart = await cartsRepo.create({ items: []});
        req.session.cartId = cart.id;
    } else { 
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    
    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({id: req.body.productId, quantity: 1});

    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    });
    //either increment quantity for exiting product, or add new product
    res.redirect('/cart');
});

router.get('/cart', async (req, res)=> {
    if (!req.session.cartId) {
        return res.redirect('/');
        }

    const cart = await cartsRepo.getOne(req.session.cartId);
    
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }
    res.send(cartShowTemplate({items: cart.items}));
});
//get request to show all items in cart

//recieve a a post request to delete an item to a cart
router.post('/cart/products/delete', async (req, res)=> {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, {items});

    res.redirect('/cart');
});


module.exports = router;