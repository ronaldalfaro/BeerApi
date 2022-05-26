const express = require('express');
const router = express.Router();
const verify = require('../controllers/authController');

//Import Beer and Consumption Model
const Beer = require('../models/beerModel');
const User = require('../models/userModel');
const Consumption = require('../models/consumptionModel');

//Get all beers route
router.get('/', verify, async (req, res) => {
  try {
    const beers = await Beer.find();
    res.json(beers);
  } catch (error) {
    res.json({
      message: error
    });
  }
});

//Get a specific beer route
router.get('/:id', verify, async (req, res) => {
  try {
    const beer = await Beer.findOne({ _id: req.params.id });

    const user = await User.findById(req.user._id);

    const consumption = await Consumption.findOne({
      beer: beer._id,
      user: user._id
    });
    let consumptionText = '';

    if (!consumption) {
      consumptionText = 'Usted ha consumido 0 cervezas ' + beer.name;
    } else {
      if (consumption.count === 1) {
        consumptionText =
          'Usted ha consumido ' + consumption.count + ' cerveza ' + beer.name;
      } else {
        consumptionText =
          'Usted ha consumido ' + consumption.count + ' cervezas ' + beer.name;
      }
    }

    res.json({ beer: beer, consumption: consumptionText });
  } catch (error) {
    res.json({
      message: error
    });
  }
});

//Submit a beer route
router.post('/', verify, async (req, res) => {
  const beer = new Beer({
    name: req.body.name,
    alcohol: req.body.alcohol,
    type: req.body.type
  });

  try {
    const savedBeer = await beer.save();
    res.json(savedBeer);
  } catch (error) {
    res.json({
      message: error
    });
  }
});

//Delete a specific beer route
router.delete('/:id', verify, async (req, res) => {
  try {
    const removedBeer = await Beer.remove({ _id: req.params.id });
    res.json(removedBeer);
  } catch (error) {
    res.json({
      message: error
    });
  }
});

//Update a specific beer route
router.patch('/:id', verify, async (req, res) => {
  try {
    await Beer.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          alcohol: req.body.alcohol,
          type: req.body.type
        }
      }
    );

    const beer = await Beer.findOne({ _id: req.params.id });

    res.json(beer);
  } catch (error) {
    res.json({
      message: error
    });
  }
});

//Submit a beer consumption
router.post('/consumption', verify, async (req, res) => {
  let beer;
  try {
    beer = await Beer.findById(req.body.beerId);
  } catch (error) {
    //error retrieving user
    res.json({
      message: error
    });
  }

  let user;
  try {
    user = await User.findById(req.user._id);
  } catch (error) {
    //error retrieving user
    res.json({
      message: error
    });
  }

  //beer, user or parameters does not exist
  if (!beer || !user || !req.body.count) {
    return res.status(400).send({ message: 'Parametros errones' });
  }

  //check if consumption of beer by this user exist
  const consumption = await Consumption.findOne({
    beer: beer._id,
    user: user._id
  });
  if (consumption) {
    //if exist then update count
    let counter = consumption.count + parseInt(req.body.count);
    await Consumption.updateOne(
      { _id: consumption._id },
      {
        $set: {
          count: counter
        }
      }
    );

    const consumptionUpdated = await Consumption.findOne({
      beer: beer._id,
      user: user._id
    });

    res.json(consumptionUpdated);
  } else {
    //if not exist then create consumption record
    const consumption2 = new Consumption({
      user: user._id,
      beer: beer._id,
      count: req.body.count
    });

    try {
      const savedConsumption = await consumption2.save();
      //consumption saved successful
      res.json(savedConsumption);
    } catch (error) {
      res.json({
        message: error
      });
    }
  }
});

module.exports = router;
