const { Op } = require("sequelize");
const db = require("../models");
const isAuthenticated = require('../config/middleware/isAuthenticated');
module.exports = function(app) {
  app.post("/api/members", (req, res) => {
    // Create an Book
    console.log(req.body);
    db.Books.create({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      UserId: req.body.UserId,
      read: req.body.read
    }).then(dbBook => {
      res.json(dbBook);
    });
  });
  app.get("/api/members", isAuthenticated, (req, res) => {
    console.log(req.user);
    const userId = req.user.id;
    db.Books.findAll({
      where: {
        UserId: userId
      }
    }).then(dbBook => {
      res.json(dbBook);
    });
  });
  app.put("/api/members", (req, res) => {
    db.Books.update(req.body, {
      where: {
        id: req.body.id
      }
    });
  });
  // 7-19-20
  app.get("/api/readbook", isAuthenticated, (req, res) => {
    const userId = req.user.id;
    db.Books.findAll({
      where: {
        read: true,
        UserId: userId
      }
    }).then(dbBook => {
      res.json(dbBook);
    });
  });
};
