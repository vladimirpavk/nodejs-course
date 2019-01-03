const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    "userId": {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    "orderDate": {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    "items": [
        {
            "productId": {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'Product'
            },
            "quantity": {
                type: mongoose.SchemaTypes.Number,
                required: true
            }
        }
    ]
});

orderSchema.statics.addOrder = function(user){
    return user.getCart()
        .then(
            (cartItems)=>{
                let orderItems = [];
                cartItems.forEach(cartItem => {
                    //console.log(cartItem.productId._id+" - "+cartItem.quantity+" - "+user._id);
                    orderItems.push({
                        productId: cartItem.productId._id,
                        quantity: cartItem.quantity
                    });                    
                });
                let newOrder = new this({
                    userId: user._id,
                    orderDate: new Date(),
                    items: orderItems
                });
                //save order
                newOrder.save();
                //clear the cart
                user.cart.items = [];
                user.save();
            }
        );
}

orderSchema.statics.getOrders = function(user){
    let orders = [];
    return this.find({
        "userId": user._id
      }).populate('items.productId')
      //može ovako ako malo razmisliš
        .then(
            (foundOrders)=>{
                return foundOrders.map(
                    (foundOrder)=>{
                        return {
                            _id : foundOrder._id,
                            items : foundOrder.items.map(
                                (item)=>{
                                    return {
                                        "title": item.productId.title,
                                        "quantity": item.quantity
                                    }
                                }
                            )
                        }
                    }
                )                    
            }
        );
        //može i brute-force ako ne želiš da razmišljaš
        /*.then(
            (foundOrders)=>{
                foundOrders.forEach(
                    (foundOrder)=>{
                        let orderItems = [];
                        foundOrder.items.forEach(                        
                            (orderItem)=>{
                                orderItems.push(
                                    {
                                        "title": orderItem.productId.title,
                                        "quantity": orderItem.quantity
                                    }
                                );
                            }
                        );                    
                        orders.push({
                            _id: foundOrder._id,
                            items: orderItems
                        });                                       
                    }
                )
                console.log(orders);
                return orders;
            }
        );*/        
}

orderSchema.statics.isUserInvoice = function(user, invoiceId){
    //console.log(user._id, invoiceId);

    return this.find({
        "_id" : new mongoose.Types.ObjectId(invoiceId),
        "userId" : user._id
    }).then(
        (foundOrders)=>{
            if(foundOrders.length === 0) return false;
            return true;            
        }
    )
    .catch((err)=>{console.log(err)});
}

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;