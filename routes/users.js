const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateUpdateProfile,
  validateUpdateAvatar,
  validateId,
} = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateId, getUserById);

router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
