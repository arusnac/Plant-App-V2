import express from "express";
import UserModel from "../models/User.js";
const router = express.Router();

router.get("/", (req, res) => {
  let param = req.query.username;
  UserModel.findOne({ userName: param }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
      console.log(param);
      console.log(result);
    }
  });
});

router.get("/plant", (req, res) => {
  let param = req.query.username;
  let plantId = req.query.id;
  const result = UserModel.findOne({ username: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    res.json(plant);
  });
});

router.post("/new", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

router.post("/update", async (req, res) => {
  // console.log(req.body);
  let param = req.query.username;
  const result = await UserModel.findOne({ userName: param }).then((doc) => {
    doc.plants.push(req.body);
    doc.save();
    res.json(doc.plants.at(-1));
  });

  // console.log(res.json(result.upsertedId));

  res.json(result);
});

router.post("/water", async (req, res) => {
  console.log(req.body);
  let param = req.query.username;
  const watered = req.body.watered;
  const plantId = req.body.id;
  console.log(req.body);

  const result = await UserModel.findOne({ username: param }).then((doc) => {
    console.log(doc);
    let plant = doc.plants.id(plantId);
    console.log(plant.id);
    plant.watered = watered;
    doc.save();
  });
  res.json(result);
});

router.post("/edit", async (req, res) => {
  console.log(req.body);
  let param = req.query.username;
  const name = req.body.name;
  const location = req.body.location;
  const plantId = req.body.id;
  console.log(req.body);

  const result = await UserModel.findOne({ username: param }).then((doc) => {
    console.log(doc);
    let plant = doc.plants.id(plantId);
    console.log(plant.id);
    plant.name = name;
    plant.location = location;
    doc.save();
  });
  res.json(result);
});

router.post("/editLocation", async (req, res) => {
  console.log(req.body);
  let param = req.query.username;
  const location = req.body.location;
  const plantId = req.body.id;
  console.log(req.body);

  const result = await UserModel.findOne({ username: param }).then((doc) => {
    console.log(doc);
    let plant = doc.plants.id(plantId);
    console.log(plant.id);
    plant.location = location;
    doc.save();
  });
  res.json(result);
});

router.post("/editImage", async (req, res) => {
  console.log(req.body);
  let param = req.query.username;
  const imagePath = req.body.imagePath;
  const plantId = req.body.id;
  console.log(req.body);

  const result = await UserModel.findOne({ username: param }).then((doc) => {
    // console.log(doc)
    let plant = doc.plants.id(plantId);
    console.log(plant.id);
    plant.image = imagePath;
    doc.save();
  });
  res.json(result);
});

router.post("/delete", async (req, res) => {
  let param = req.query.username;
  const plantId = req.body.id;

  const result = await UserModel.findOne({ username: param }).then((doc) => {
    const index = doc.plants.findIndex((element) => element.id === plantId);
    doc.plants.splice(index, 1);
    doc.save();
  });
  res.json(result);
});

export default router;
