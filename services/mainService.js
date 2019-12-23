const mathjax = require("mathjax-full/js/mathjax");
const TeX = require("mathjax-full/js/input/tex");
const SVG = require("mathjax-full/js/output/svg");
const LiteAdaptor = require("mathjax-full/js/adaptors/liteAdaptor");
const RegisterHTMLHandler = require("mathjax-full/js/handlers/html");
const AllPackages = require("mathjax-full/js/input/tex/AllPackages");

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

    convert(req, res) {
        let that = this;
        const equation = req.query.equation;
        const color = "black";
        const normalizedEquation = equation.replace(/\.(svg)$/, "");

        try {
            const svgString = that.tex2svg(normalizedEquation, color);
            const imageData = svgString;
        
            res.setHeader("cache-control", "s-maxage=604800, maxage=604800");
        
            // render equation
            res.contentType("image/svg+xml");
            res.write(`<?xml version="1.0" standalone="no" ?>
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
            `);
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