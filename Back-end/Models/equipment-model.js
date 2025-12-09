import mongoose from "mongoose";

const  Schema = mongoose.Schema ({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    purchaseDate: { type: Date, required: true},
    validityDate: { type: Date, required: true },
    discountPercentage: { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 }
})

export default mongoose.model('equipment', Schema, 'equipment');
