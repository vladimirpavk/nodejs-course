const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type : String,
    required : true
  },
  price: {
    type : Number,
    required : true
  },
  description: {
    type : String,
    required : true
  },
  imageUrl: {
    type : String,
    required : true
  },
  //demand is to know which user created that product
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required : true
  }
});

productSchema.statics.fetchAll = function(){
   return this.find();
}

module.exports = mongoose.model('Product', productSchema);