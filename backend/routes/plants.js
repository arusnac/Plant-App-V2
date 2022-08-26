import express from "express";
import PlantModel from "../models/Plant.js";
const router = express.Router();

router.get("/", (req, res) => {
  PlantModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

router.post("/create", async (req, res) => {
  const plant = req.body;
  const newPlant = new PlantModel(plant);
  await newPlant.save();

  res.json(plant);
});

export default router;
