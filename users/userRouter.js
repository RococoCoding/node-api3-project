const express = require('express');
const { get, getById, getUserPosts, insert, update, remove } = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  try {
    const newUser = await insert(req.body);
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      res.status(500).json(`No user added.`);
    }
  } catch(err) {
    console.log(err);
    res.status(500).json(`User data received and validated but error adding to db.`);
  }
});

router.post('/:id/posts', [validateUserId, validatePost], async (req, res) => {
  const newPost = {...req.body, user_id: req.params.id};
  try {
    const returnedPost = await postDb.insert(newPost);
    if (returnedPost) {
      res.status(201).json(returnedPost);
    } else {
      res.status(404).json(`Error returning new post.`);
    }
  } catch(err) {
    res.status(500).json(`Error adding new post.`);
  }
});

router.get('/', async (req, res) => {
  try {
    const allUsers = await get();
    if (allUsers.length > 0) {
      res.status(200).json(allUsers);
    } else {
      res.status(404).json(`No users were found`);
    }
  } catch(err) {
    console.log(err);
    res.status(500).json(`Error getting posts.`);
  }
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(res.user);
});

router.get('/:id/posts', [validateUserId], async (req, res) => {
  try {
    const allPosts = await getUserPosts(req.params.id);
    if (allPosts) {
      res.status(200).json(allPosts);
    } else {
      res.status(404).json(`No posts found for user ${req.params.id}`);
    }
  } catch {
    res.status(500).json(`Erro getting posts for user ${req.params.id}`); 
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // do your magic!
  try {
    const returned = await remove(req.params.id);
    if (returned > 0) {
      res.status(200).json(`User ${req.params.id} has been deleted.`);
    } else {
      res.status(404).json(`User id matched, but did not update user.`);
    }
  } catch(err) {
    console.log(err.message);
    res.status(500).json(`Error deleting user.`);
  }
});

router.put('/:id', [validateUserId, validateUser], async (req, res) => {
  try {
    const numUpdated = await update(req.params.id, req.body);
    if (numUpdated > 0) {
      res.status(200).json(`User ${req.params.id} updated.`);
    } else {
      res.status(500).json(`User ${req.params.id} not updated.`);
    }
  } catch(err) {
    console.log(err.message);
    res.status(500).json(`User id and data validated but error updating.`);
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const userInfo = await getById(req.params.id);
    if (userInfo) {
      res.user = userInfo;
      next();
    } else {
      res.status(404).json(`Could not find user with id ${req.params.id}`);
    }
  } catch(err) {
    console.log(err);
    res.status(500).json(err.message);
  }
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({msg: "missing res.body"});
  } else if (!req.body.name) {
    res.status(400).json({msg: "missing res.body.name"});
  }
  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({msg: "missing res.body"});
  } else if (!req.body.text) {
    res.status(400).json({msg: "missing res.body.text"});
  }
  next();
}

module.exports = router;
