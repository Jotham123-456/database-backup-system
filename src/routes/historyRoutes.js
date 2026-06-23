const express = require("express");

const router = express.Router();

const history =
    require("../utils/history");

router.get("/", (req, res) => {

    res.json(history.getAll());

});

module.exports = router;