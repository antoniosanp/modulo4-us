import mongoose from "mongoose";

const historialSchema = new mongoose.Schema({
  contenidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content"
  },
  fechaVisualizacion: Date,
  progreso: Number
});

const listaSchema = new mongoose.Schema({
  nombre: String,
  contenidos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content"
  }]
});

const userSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  edad: Number,
  pais: String,
  plan: { type: String, enum: ["free", "premium"] },
  historial: [historialSchema],
  listas: [listaSchema]
}, { timestamps: true });

export default mongoose.model("User", userSchema);