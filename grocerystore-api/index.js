const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 4000;
const cors = require('cors')
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())


// Connect to MongoDB using Mongoose
const url = ""

const connectDB = () => {
    return mongoose.connect(url)
        .then(() => { console.log('connected to db'); })
        .catch((err) => { console.log(err) })
}


// Define schema
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    labels: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    popularItem: {
        type: Boolean,
        required: true,
    },
    availablequantity: {
        type: Number,
        required: true,
    }
})

var orderSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    orderdetail: [
        new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        })
    ],
    totalprice: {
        type: Number,
        required: true,
    }
})


var Product = mongoose.model("Product", productSchema, "Products")
var Order = mongoose.model("Order", orderSchema, "Orders")

// Create a route for getting all products
const getAllProducts = async (req, res) => {
    try {
        console.log("get products")
        const allProducts = await Product.find({});
        res.status(200).json({ allProducts: allProducts });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
app.get('/api/products', getAllProducts);


// Create a route for geting all products with popularItem true
const getPopularProduct = async (req, res) => {
    try {
        const popularProducts = await Product.find({ popularItem: true });
        res.status(200).json({ popularProducts: popularProducts });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
app.get('/api/products/popular', getPopularProduct);



const createOrder = async (req, res) => {
    try {
        console.log(req.body)
        console.log("create order")
        const order = await Order.create(req.body);
        res.status(200).json({ order: order });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
app.post('/api/order', createOrder);



const updateProduct = async (req, res) => {
    try {
        console.log(req.body);
        console.log("update products");
        const updatedResult = await Product.findOneAndUpdate({
            name: req.params.name,
            availablequantity:{$gte: 0}
          }, {
            $inc: {
              availablequantity: -req.body.quantity
            }
          }, {
            new: true
          });
        res.status(200).json({ updatedResult: updatedResult });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
app.patch('/api/updateProducts/:name', updateProduct);


const start = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();