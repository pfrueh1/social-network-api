const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');

router.get('/', (req, res) => {
    Thought.find({})
    .select('-__v')
    .then(thoughtData => res.json(thoughtData))
    .catch(err => res.status(400).json(err));
})

router.get('/:id', ({params}, res) => {
    Thought.findOne({ _id: params.id})
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .then(thoughtData => {
        if(!thoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thoughtData)
    })
    .catch(err => res.status(400).json(err));
})

//create new thought
router.post('/', ({body}, res) => {
    console.log('1', body)
    Thought.create(body)
    .then(({userId, _id}) => {
        console.log('2', body)
        return User.findOneAndUpdate(
            {_id: userId},
            {$push: {thoughts: _id}},
            {new: true}
        )
    })
    .then(thoughtData => {
        res.json(thoughtData)
    })
    .catch(err => res.status(400).json(err));
})

router.put('/:id', ({params, body}, res) => {
    Thought.findOneAndUpdate({ _id: params.id}, body, {new: true, runValidators: true})
    .then(thoughtData => {
        if(!thoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thoughtData)
    })
    .catch(err => res.status(400).json(err));
})

router.delete('/:id', ({params}, res) => {
    Thought.findOneAndDelete({ _id: params.id})
    .then(thoughtData => {
        if(!thoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thoughtData)
    })
    .catch(err => res.status(400).json(err));
})

//create reaction
router.post('/:id/reactions', ({params, body}, res) => {
    Thought.findOneAndUpdate(
        {_id: params.id},
        {$push: {reactions: body}},
        {new: true, runValidators: true})
        .then(thoughtData => {
            res.json(thoughtData)
        })
        .catch(err => res.status(400).json(err));
})

//delete reaction
router.delete('/:id/reactions/:reactionId', ({params, body}, res) => {
    Thought.findOneAndUpdate(
        {_id: params.id},
        {$pull: {reactions: {reactionId: params.reactionId}}},
        {new: true, runValidators: true})
        .then(thoughtData => {
            res.json(thoughtData)
        })
        .catch(err => res.status(400).json(err));
})

module.exports = router;
