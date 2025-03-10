const express = require("express");
const {getUser, getAllUser, getAllGender, addUser, editUser, deleteUser} = require("../controllers/user.controller.js")
const validateInfo = require("../middlewares/validateUser.middleware.js")

const router = express.Router();

router.get('/get-user/:id', getUser);
router.get('/get-all-user', getAllUser);
router.get('/get-gender', getAllGender);
router.post('/add-user', validateInfo, addUser);
router.put('/edit-user/:id', validateInfo, editUser);
router.delete('/delete-user/:id', deleteUser);

router.get('/*', (req, res) => {
    res.status(404).json({
        success : false,
        message : "Route not found"
    })
});

module.exports = router;