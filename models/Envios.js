import mongoose from "mongoose";

const envioSchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    destinatario: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    ciudadDestino: {
      type: String,
      required: true,
      trim: true,
    },

    estado: {
      type: String,
      enum: [
        "En Almacén",
        "En Reparto",
        "Entregado",
        "Incidencia",
      ],
      default: "En Almacén",
      required: true,
    },

    prioridad: {
      type: String,
      enum: [
        "Estándar",
        "Express",
        "Urgente",
      ],
      default: "Estándar",
      required: true,
    },

    repartidor: {
      type: String,
      trim: true,
    },

    intentosEntrega: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },

    notasRuta: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Envios ||
  mongoose.model("Envios", envioSchema);