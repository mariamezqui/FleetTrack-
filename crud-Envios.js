import dotenv from "dotenv";
import mongoose from "mongoose";
import Envio from "./models/Envios.js";

dotenv.config();

async function ejecutarCRUD() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Conectado a MongoDB");

    await Envio.deleteMany({});

    console.log("Colección limpiada");

    const envios = await Envio.insertMany([
  {
    trackingCode: "ENV-9001",
    destinatario: "Ana García",
    ciudadDestino: "Valencia",
    prioridad: "Urgente",
    notasRuta: ["fragil", "asegurado"]
  },
  {
    trackingCode: "ENV-9002",
    destinatario: "Luis Romero",
    ciudadDestino: "Madrid",
    estado: "En Reparto",
    prioridad: "Express",
    repartidor: "Pedro Ruiz"
  },
  {
    trackingCode: "ENV-9003",
    destinatario: "Marta López",
    ciudadDestino: "Barcelona",
    estado: "Incidencia",
    prioridad: "Estándar"
  },
  {
    trackingCode: "ENV-9004",
    destinatario: "Carlos Díaz",
    ciudadDestino: "Valencia",
    estado: "Entregado",
    prioridad: "Express",
    repartidor: "Juan Torres",
    notasRuta: ["fragil"]
  },
  {
    trackingCode: "ENV-9005",
    destinatario: "Laura Sánchez",
    ciudadDestino: "Madrid",
    prioridad: "Urgente",
    notasRuta: ["fragil", "asegurado"]
  }
]);

console.log(" Envíos insertados");
console.log(envios);

// -------------------
// READ
// -------------------

console.log("\n CONSULTA 1 - $or");

const consultaOr = await Envio.find({
  $or: [
    { prioridad: "Urgente" },
    { estado: "Incidencia" }
  ]
});

console.log(consultaOr);

console.log("\n CONSULTA 2 - $exists");

const sinRepartidor = await Envio.find({
  repartidor: {
    $exists: false
  }
});

console.log(sinRepartidor);

console.log("\n CONSULTA 3 - $regex");

const enviosValencia = await Envio.find({
  ciudadDestino: {
    $regex: "valencia",
    $options: "i"
  }
});

console.log(enviosValencia);

console.log("\n CONSULTA 4 - $all");

const fragilYAsegurado = await Envio.find({
  notasRuta: {
    $all: ["fragil", "asegurado"]
  }
});

console.log(fragilYAsegurado);

// -------------------
// UPDATE
// -------------------

console.log("\n UPDATE INDIVIDUAL");

// Actualizamos ENV-9001
const actualizado = await Envio.findOneAndUpdate(
  {
    trackingCode: "ENV-9001"
  },
  {
    $set: {
      repartidor: "Miguel Pérez",
      estado: "En Reparto"
    },
    $inc: {
      intentosEntrega: 1
    },
    $push: {
      notasRuta: "Intento 1 realizado"
    }
  },
  {
    new: true,
    runValidators: true
  }
);

console.log(actualizado);

console.log("\n UPDATE MASIVO");

const resultadoMasivo = await Envio.updateMany(
  {
    repartidor: {
      $exists: false
    }
  },
  {
    $set: {
      repartidor: "Flota Central"
    }
  }
);

// -------------------
// DELETE
// -------------------

console.log("\n DELETE");

const eliminado = await Envio.findOneAndDelete({
  estado: "Entregado"
});

console.log(eliminado);

const restantes = await Envio.countDocuments();

console.log(` Documentos restantes: ${restantes}`);

await mongoose.disconnect();

console.log(" Desconectado de MongoDB");

console.log(resultadoMasivo);

  } catch (error) {
    console.error(error);
  }
}

ejecutarCRUD();