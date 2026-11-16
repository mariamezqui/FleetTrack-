import mongoose from "mongoose";
import Envio from "../models/Envio.js";

async function conectarDB() {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(process.env.MONGODB_URI);
}

export default async function handler(req, res) {
  await conectarDB();

  try {

    switch (req.method) {

      case "GET": {

  const filtro = {};

  if (req.query.estado) {
    filtro.estado = req.query.estado;
  }

  if (req.query.ciudad) {
    filtro.ciudadDestino = {
      $regex: req.query.ciudad,
      $options: "i"
    };
  }

  if (req.query.sinRepartidor === "true") {
    filtro.repartidor = {
      $exists: false
    };
  }

  const envios = await Envio.find(filtro);

  return res.status(200).json(envios);
}

      case "POST": {

  const nuevoEnvio = await Envio.create(req.body);

  return res.status(201).json(nuevoEnvio);
}

      case "PATCH": {

  const { trackingCode } = req.query;

  const update = {};

  if (req.body.estado) {
    update.$set = {
      ...(update.$set || {}),
      estado: req.body.estado
    };
  }

  if (req.body.repartidor) {
    update.$set = {
      ...(update.$set || {}),
      repartidor: req.body.repartidor
    };
  }

  if (req.body.sumarIntento) {
    update.$inc = {
      intentosEntrega: 1
    };
  }

  if (req.body.nuevaNota) {
    update.$push = {
      notasRuta: req.body.nuevaNota
    };
  }

  if (req.body.quitarNota) {
    update.$pull = {
      notasRuta: req.body.quitarNota
    };
  }

  const envio = await Envio.findOneAndUpdate(
    { trackingCode },
    update,
    {
      new: true,
      runValidators: true
    }
  );

  return res.status(200).json(envio);
}

case "DELETE": {

  const { trackingCode } = req.query;

  const eliminado = await Envio.findOneAndDelete({
    trackingCode
  });

  if (!eliminado) {
    return res.status(404).json({
      error: "Envío no encontrado"
    });
  }

  return res.status(200).json({
    mensaje: "Envío eliminado correctamente",
    eliminado
  });
} 