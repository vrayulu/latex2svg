const async = require('async');
const mathjax = require("mathjax-full/js/mathjax");
const TeX = require("mathjax-full/js/input/tex");
const SVG = require("mathjax-full/js/output/svg");
const LiteAdaptor = require("mathjax-full/js/adaptors/liteAdaptor");
const RegisterHTMLHandler = require("mathjax-full/js/handlers/html");
const AllPackages = require("mathjax-full/js/input/tex/AllPackages");
const svg2img = require("svg2img");

const adaptor = new LiteAdaptor.LiteAdaptor();
RegisterHTMLHandler.RegisterHTMLHandler(adaptor);

const html = mathjax.mathjax.document("", {
    InputJax: new TeX.TeX({ packages: AllPackages.AllPackages }),
    OutputJax: new SVG.SVG({ fontCache: "none" })
});

class LatexService {
    constructor() {
    }

    tex2svg(equation, color) {
        const svg = adaptor
          .innerHTML(html.convert(equation, { display: true }))
          .replace(/fill="currentColor"/, `fill="${color}"`);
        if (svg.includes("merror")) {
          return svg.replace(/<rect.+?><\/rect>/, "");
        }
        return svg;
    }

    svg2png(svgString) {
      return new Promise(function (resolve, reject) {
        var dims = svgString
            .match(/width="([\d.]+)ex" height="([\d.]+)ex"/)
            .slice(1)
            .map(function (s) { return parseFloat(s); }), width = dims[0], height = dims[1];
        var args = {
          width: width * 3 + "ex",
          height: height * 3 + "ex"
        };
        svg2img(svgString, args, function(error, buffer) {
          if (error) {
            return reject(error);
          }
          resolve(buffer);
        });
      });
    }

    async convert(req, res) {
        let that = this;
        const equation = req.query.equation;
        let color = "black";
        const isPNG = /\.png$/.test(equation);
        const normalizedEquation = equation.replace(/\.(svg|png)$/, "");

        try {
            const svgString = that.tex2svg(normalizedEquation, color);
            let imageData = svgString;
        
            res.setHeader("cache-control", "s-maxage=604800, maxage=604800");
        
            // render equation
            if (isPNG) {
              imageData = await that.svg2png(svgString);
              res.contentType("image/png");
            } else {
              res.contentType("image/svg+xml");
              res.write(`<?xml version="1.0" standalone="no" ?>
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
              `);
            }
            res.end(imageData);
        } catch (err) {
            res.write(
              '<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">'
            );
            res.write(err);
            res.end("</text></svg>");
          }
    }

}

module.exports = new LatexService();