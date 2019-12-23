const express = require("express"),
  path = require("path"),
  cors = require("cors"),
  latexService = require("../services/mainService");

module.exports = app => {
  //
  app.options("*", cors());

  app.set("view engine", "ejs");
  
  app.get("/convert", (req, res) =>
    latexService.convert(req, res)
  );
};
