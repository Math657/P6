const Sauce = require('../models/sauce')
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
        usersLiked: [],
        usersDisliked: [],
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
    const likeStatus = req.body.like
    const user = req.body.userId
    Sauce.findOne({_id: req.params.id})
    .then(sauce => { 
        if (likeStatus == 1 && !sauce.usersLiked.includes(user)) {         
                sauce.usersLiked.push(user)
                sauce.likes ++ 
        }

        if (likeStatus == -1 && !sauce.usersDisliked.includes(user)) {
                sauce.usersDisliked.push(user)
                sauce.dislikes ++
        } 

        else if (likeStatus == 0) {
            if (sauce.usersLiked.includes(user)) {
                    const arrLiked = sauce.usersLiked
                    const i = arrLiked.indexOf(user)
                    arrLiked.splice(i, 1)
                    //sauce.usersLiked.filter(e => e !== user)
                    sauce.likes --
            }

            if (sauce.usersDisliked.includes(user)) {
                    const arrDisliked = sauce.usersDisliked
                    const i = arrDisliked.indexOf(user)
                    arrDisliked.splice(i, 1)
                    //sauce.usersDisliked.filter(e => e !== user)
                    sauce.dislikes --
            }
        }
    sauce.save()
    .then(() => res.status(201).json({ message: 'Statut like/dislike définit !'}))
    .catch(error => res.status(503).json({error}))   
    }) 
    .catch(error => res.status(503).json(error)
    )
}








// if (sauce.usersLiked.include(user)) {
            //     switch (likeStatus) {  // revoir la logique (si on a 1 ou -1, alors...)
            //         case 1:
            //             sauce.usersLiked.filter(e => e !== user) // indexof c'est un tableau pas de soustraction sur tableau
            //             sauce.likes -= 1
            //             likeStatus = 0
            //         break

            //         case -1:
            //             sauce.usersLiked -= user
            //             sauce.likes -= 1
            //             sauce.usersDisliked += user
            //             sauce.dislikes += 1
            //         break
            //     }
            // }

            // if (sauce.usersDisliked.include(user)) {
            //     switch (likeStatus) {
            //         case 1:
            //             sauce.usersDisliked -= user
            //             sauce.dislikes -= 1
            //             sauce.usersLiked += user
            //             sauce.likes += 1
            //         break

            //         case -1:
            //             sauce.usersDisliked -= user
            //             sauce.dislikes -= 1
            //             likeStatus = 0
            //         break
            //     }
            // }

            // else {
            //     switch (likeStatus) {
            //         case 1:
            //             sauce.usersLiked += user
            //             sauce.likes += 1
            //         break

            //         case -1: 
            //             sauce.usersDisliked += user
            //             sauce.dislikes += 1
            //         break
            //     }
            // }  