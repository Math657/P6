const Sauce = require('../models/sauce')
const User = require('../models/user')
const fs = require('fs')

exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => res.status(503).json({error}))
}

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: '',
        usersDisliked: '',
    })
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !'}))
    .catch(error => res.status(503).json({error}))
}

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce)})
    .catch((error) => {res.status(503).json({error})})
}

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée!'}))
    .catch(error => res.status(503).json({error}))
}

exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce supprimée!'}))
            .catch(error => res.status(503).json(error))
        })
    })
}

exports.likeSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
}