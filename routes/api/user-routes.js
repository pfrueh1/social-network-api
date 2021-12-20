const router = require('express').Router();
const { json } = require('body-parser');
const User = require('../../models/User');

router.get('/', (req, res) => {
    User.find({})
    .select('-__v')
    .then(userData => res.json(userData))
    .catch(err => res.status(400).json(err));
})

router.get('/:id', ({params}, res) => {
    User.findOne({ _id: params.id})
    .populate({        
        path: 'friends',
        select: '-__v'
    })
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .select('-__v')
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData)
    })
    .catch(err => res.status(400).json(err));
})

router.post('/', ({body}, res) => {
    User.create(body)
    .then(userData => res.json(userData))
    .catch(err => res.status(400).json(err));
})

router.put('/:id', ({params, body}, res) => {
    User.findOneAndUpdate({ _id: params.id}, body, {new: true, runValidators: true})
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData)
    })
    .catch(err => res.status(400).json(err));
})

router.delete('/:id', ({params}, res) => {
    User.findOneAndDelete({ _id: params.id})
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData)
    })
    .catch(err => res.status(400).json(err));
})

//add friend
router.post('/:id/friends/:fid', ({params}, res) => {
    User.findOneAndUpdate(
        {id: params.id},
        {$addToSet: {friends: params.fid}},
        {new: true, runValidators: true}
    )
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData)
    })
    .catch(err => res.status(400).json(err));
})
//delete friend
router.delete('/:id/friends/:fid', ({params}, res) => {
    User.findOneAndUpdate(
        {id: params.id},
        {$pull: {friends: params.fid}},
        {new: true, runValidators: true}
    )
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData)
    })
    .catch(err => res.status(400).json(err));
})

module.exports = router;