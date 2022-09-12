import express from "express";
import UserModel from "../models/User.js";
const router = express.Router();

//return all the plants for this user
router.get("/", (req, res) => {
  const param = req.query.username;
  //Optional parameter
  let option = req.query.option ? req.query.attribute : "";

  UserModel.findOne({ userName: param }, (err, result) => {
    //Filter the results and return based on the optional parameter
    if (option) {
      const filtered = result.plants.filter(
        (plant) => plant.location === option
      );
      res.json(filtered);
    } else if (err) {
      res.json(err);
    }
    //Return all plants for the user
    else {
      res.json(result);
    }
  });
});

//return a specific plant by id
router.get("/plant", (req, res) => {
  let param = req.query.username;
  let plantId = req.query.id;
  UserModel.findOne({ userName: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    res.json(plant);
  });
});

//Get all notes for a plant using it's id
router.get("/notes", (req, res) => {
  const plantId = req.body.id;
  const user = req.body.id;

  UserModel.findOne({ userName: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    res.json(plant.notes);
  });
});

//Create a new user
router.post("/new", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

router.post("/update", async (req, res) => {
  let param = req.query.username;
  await UserModel.findOne({ userName: param }).then((doc) => {
    doc.plants.push(req.body);
    doc.save();
    res.json(doc.plants.at(-1));
  });

  res.json(result);
});

//Update the watered date based on plant id
router.post("/water", async (req, res) => {
  let param = req.query.username;
  const watered = req.body.watered;
  const plantId = req.body.id;

  const result = await UserModel.findOne({ userName: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    plant.watered = watered;
    doc.save();
  });
  res.json(result);
});

//Edit name and/or location
router.post("/edit", async (req, res) => {
  let param = req.query.username;
  const name = req.body.name;
  const location = req.body.location;
  const plantId = req.body.id;

  const result = await UserModel.findOne({ userName: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    plant.name = name;
    plant.location = location;
    doc.save();
  });
  res.json(result);
});

//Adds or edits note related to the plant
router.post("/note", async (req, res) => {
  const username = req.body.username;
  const noteBody = req.body.noteBody;
  const noteTitle = req.body.noteTitle;
  const plantId = req.body.id;
  const toDo = req.body.toDo;
  const idx = req.body.idx;

  const result = await UserModel.findOne({ userName: username }).then((doc) => {
    let plant = doc.plants.id(plantId);

    if (toDo === "add") {
      plant.notes.push({ noteTitle, noteBody });
      doc.save();
    } else if (toDo === "update") {
      doc.plants.id(plantId).notes[idx].noteTitle = noteTitle;
      doc.plants.id(plantId).notes[idx].noteBody = noteBody;
      doc.save();
    }
  });

  res.json(result);
});

router.post("/editLocation", async (req, res) => {
  let param = req.query.username;
  const location = req.body.location;
  const plantId = req.body.id;

  const result = await UserModel.findOne({ userName: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    plant.location = location;
    doc.save();
  });
  res.json(result);
});

//Change the images url for a specific plant
router.post("/editImage", async (req, res) => {
  let param = req.query.username;
  const imagePath = req.body.imagePath;
  const plantId = req.body.id;

  const result = await UserModel.findOne({ userName: param }).then((doc) => {
    let plant = doc.plants.id(plantId);
    plant.image = imagePath;
    console.log(plant.image);
    doc.save();
  });
  res.json(result);
});

//Deletes the plant or note from the DB
//Requires username, plant id, which type to delete
//and the note index (if a note is to be deleted)
router.post("/delete", async (req, res) => {
  const param = req.body.username;
  const plantId = req.body.id;
  const toDelete = req.body.toDelete;
  const noteIndex = req.body.idx;

  if (toDelete === "plant") {
    const result = await UserModel.findOne({ userName: param }).then((doc) => {
      const index = doc.plants.findIndex((element) => element.id === plantId);
      doc.plants.splice(index, 1);
      doc.save();
    });
    res.json(result);
  } else if (toDelete === "note") {
    const result = await UserModel.findOne({ userName: param }).then((doc) => {
      doc.plants.id(plantId).notes.splice(noteIndex, 1);
      doc.save();
    });
    res.json(result);
  }
});

export default router;
