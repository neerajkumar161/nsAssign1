const router = require('express').Router();

const Routes = require('./routes/');

router.use('/user', Routes.user);
// router.use('/admin', Routes.admin);

module.exports = router;
