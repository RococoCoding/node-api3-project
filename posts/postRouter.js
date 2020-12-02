const express = require('express');
const { get, getById, insert, update, remove } = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  get()
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({msg: "No posts found"});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error fetching posts. ${err.status} ${err.message}`);
    });
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(res.data);
});

router.delete('/:id', validatePostId, (req, res) => {
  remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json(`Post ${req.params.id} was deleted.`);
      } else {
        res.status(404).json(`Could not find post to delete.`)
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({msg: `Error occurred deleting post ${req.params.id}`});
    })
});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  update(id, req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(`Post ${id} was updated.`);
      } else {
        res.status(404).json(`No post ${id} was found.`);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error occurred updating post.`)
    })
});

// custom middleware

function validatePostId(req, res, next) {
  getById(req.params.id)
  .then(data => {
    if (data) {
      res.data = data;
      next();
    } else {
      res.status(404).json(`No post was found at id ${req.params.id}`)
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg:"Error occurred fetching post."})
  })
}

module.exports = router;
