const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String
  },
  resetTokenExpiration: {
    type: mongoose.SchemaTypes.Date
  },
  cart: {
    items: [
      {
        productId: { 
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(productId){
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const productIndex = this.cart.items.findIndex(
      (cp)=>{
        return cp.productId == productId;
      }
    )

    if(productIndex != -1){
      //the same product is already in the cart 
      this.cart.items[productIndex].quantity+=1;
    }
    else{
      //Product with the productId is not in the cart
      this.cart.items.push(
        {
          productId : productObjectId,
          quantity : 1
        }
        );
    }
    return this.save(); 
}

userSchema.methods.getCart = function(){
  return this.populate('cart.items.productId').execPopulate()
    .then(
      (user)=>{
        return user.cart.items;
      }
    )
    .catch(
      (err)=>{
        return err;
      }
    )
}

userSchema.methods.deleteItemFromCart = function(prodId){
  const updatedCartItems = this.cart.items.filter(
    (cartItem)=>{      
      return cartItem.productId.toString() !== prodId.toString();
    }
  ); 
  this.cart.items = updatedCartItems;
  return this.save();
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;