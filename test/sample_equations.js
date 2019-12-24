const expect  = require('chai').expect;
const request = require('request');
const fs = require('fs');

const testEquations = [
    {title: "Area of circle", "latex": "A = \\pi r^2"},
    {title: "Quadratic equation", "latex": "x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}"},
    {title: "Binomial theorem", "latex": "(x+a)^n = \\sum _{k=0}^n(\\frac{n_{ }}{k})x^ka^{n-k}"},
    {title: "Expansion of a sum", "latex": "(1+x)^n=1+\\frac{nx}{1!}+\\frac{n(n-1)x^2}{2!}+......."},
    {title: "Fourier series", "latex": "f(x)=a_0+\\sum _{n=1}^{\\infty }(a_n\\cos \\frac{n\\Pi x}{L}+b_n\\sin \\frac{n\\Pi x}{L})"},
    {title: "Slope of a line", "latex": "m=\\frac{y_2-y_1}{x_2-x_1}"},
    {title: "Distance between two points", "latex": "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}"},
    {title: "Volume of a sphere", "latex": "\\frac{4}{3}\\pi r^3"},
    {title: "Product rule", "latex": "a^n\\times a^m=a^{n+m}"}
  ];

const greekSymbols = [{latex: "\\alpha"}, {latex: "\\beta"}, {latex: "\\delta"}, {latex: "\\epsilon"}, {latex: "\\eta"}, {latex: "\\gamma"}, {latex: "\\iota"}, {latex: "\\kappa"}, {latex: "\\lambda"}, {latex: "\\mu"}, {latex: "\\nu"}, {latex: "o"}, {latex: "\\omega"}, {latex: "\\phi"}, {latex: "\\pi"}, {latex: "\\psi"}, {latex: "\\rho"}, {latex: "\\sigma"}, {latex: "\\tau"}, {latex: "\\theta"}, {latex: "\\upsilon"}, {latex: "\\xi"}, {latex: "\\zeta"}, {latex: "\\Delta", title: "Delta_1"}, {latex: "\\Gamma", title: "Gamma_1"}, {latex: "\\Lambda", title: "Lambda_1"}, {latex: "\\Omega", title: "Omega_1"}, {latex: "\\Phi", title: "Phi_1"}, {latex: "\\Pi", title: "Pi_1"}, {latex: "\\Psi", title: "Psi_1"}, {latex: "\\Sigma", title: "Sigma_1"}, {latex: "\\Theta", title: "Theta_1"}, {latex: "\\Upsilon", title: "Upsilon_1"}];
const binarySymbols = [{latex: "\\ast"}, {latex: "\\times"}, {latex: "\\div"}, {latex: "\\cdot"}, {latex: "\\equiv"}, {latex: "\\cong"}, {latex: "\\ne"}, {latex: "\\sim"}, {latex: "\\simeq"}, {latex: "\\approx"}, {latex: "\\propto"}, {latex: "\\models"}, {latex: "\\pm"}, {latex: "\\mp"}, {latex: "\\leq"}, {latex: "\\ll"}, {latex: "\\subset"}, {latex: "\\subseteq"}, {latex: "\\in"}, {latex: "\\perp"}, {latex: "\\mid"}, {latex: "\\parallel"}, {latex: "\\notin"}, {latex: "\\cap"}, {latex: "\\cup"}, {latex: "\\geq"}, {latex: "\\wedge"}, {latex: "\\vee"}, {latex: "\\gg"}, {latex: "\\supset"}, {latex: "\\supseteq"}, {latex: "a^b"}, {latex: "\\lt"}, {latex: "\\gt"}, {latex: "+"}, {latex: "-"}];
const arrows = [{latex: "\\leftarrow", title: "leftarrow_single"}, {latex: "\\Leftarrow"}, {latex: "\\rightarrow", title: "rightarrow_single"}, {latex: "\\Rightarrow"}, {latex: "\\leftrightarrow", title: "leftrightarrow_single"}, {latex: "\\Leftrightarrow"}, {latex: "\\rightharpoonup"}, {latex: "\\rightharpoondown"}];
const miscSymbols = [{latex: "\\infty"}, {latex: "\\nabla"}, {latex: "\\partial"}, {latex: "\\angle"}, {latex: "\\measuredangle"}, {latex: "\\triangle"}, {latex: "\\square"}, {latex: "\\overrightarrow{AB}"}, {latex: "A^T"}, {latex: "A^{-1}"}, {latex: "^c"}, {latex: "^g"}, {latex: "\\overline{x}"}, {latex: "\\vec{x}"}, {latex: "\\hat{x}"}];
const trigEquations = [{latex: "\\sin\\theta"}, {latex: "\\cos\\theta"}, {latex: "\\sec\\theta"}, {latex: "\\csc\\theta"}, {latex: "\\tan\\theta"}, {latex: "\\cot\\theta"}, {latex: "\\log_{b}a"}, {latex: "\\lg"}, {latex: "\\ln"}, {latex: "\\lim_{x\\to\\infty}\\left(\\right)", latexDisplay: "lim"}, {latex: "\\dim"}, {latex: "y^{(n)}"}, {latex: "\\frac{dy}{dx}"}, {latex: "\\frac{d^2y}{dx^2}"}, {latex: "\\frac{d^ny}{dx^n}"}, {latex: "\\frac{\\partial f(x,y)}{\\partial x}"}, {latex: "\\int "}, {latex: "\\int _{a}^{b}"}, {latex: "\\oint"}];
const supsubEquations = [{ latex: "x^2", latexDisplay: "x^2"}, {latex: "e^{5}", latexDisplay: "e^{\\square}"}, {latex: "{a}^{b}", latexDisplay: "\\square^\\square"}, {latex: "x_2", latexDisplay: "x_2"}, {latex: "{a}_{b}", latexDisplay: "\\square_\\square"}];
const rootEquations = [{latex: "\\sqrt{\\square}"}, {latex: "\\sqrt[\\square]{\\square}"}, {latex: "\\sqrt[3]{a}"}, {latex: "\\sqrt[4]{1}"}];
const fractions = [{latex: "\\frac{\\square}{\\square}"}];
const miscEquations = [{ latex: "\\sigma^2" }, { latex: "\\sigma_X" }, { latex: "\\rho_{X,Y}" }, { latex: "_n P^k" }, { latex: "_n C^k" }, { latex: "\\binom{n}{k}" }];
const advancedEquations = [{latex: "\\begin{vmatrix} a&b\\\\ c&d\\\\ \\end{vmatrix}" }, {latex: "\\begin{matrix} a&b\\\\ c&d\\\\ \\end{matrix}" }, {latex: "\\begin{bmatrix} a&b\\\\ c&d\\\\ \\end{bmatrix}" }, {latex: "\\xrightarrow{\\Delta}" }, {latex: "\\sphericalangle" }, {latex: "\\xleftrightharpoons{abc}", customImage: 'assets/equilibrium.png' }, {latex: "\\leftrightarrows" }, {latex: "\\widetilde{a}" }, {latex: "\\overgroup{AB}", customImage: 'assets/arc.png'}];

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var getFilename = function (eq) {
    let title = eq.latex;
    if (eq.title)
        title = eq.title;
    else if (eq.latex) {
        title = eq.latex;
        if (title.startsWith("\\"))
            title = eq.latex.substring(1);
    }
    return title;
};

it('Test Sample Equations', function(done) {
    testEquations.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/equations/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Greek Symbols', function(done) {
    greekSymbols.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/greekSymbols/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Binary Symbols', function(done) {
    binarySymbols.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/binarySymbols/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Arrows', function(done) {
    arrows.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/arrows/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Misc Symbols', function(done) {
    miscSymbols.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/miscSymbols/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Trigonometry Equations', function(done) {
    trigEquations.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/trigEquations/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Superscript & Subscript Equations', function(done) {
    supsubEquations.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/supsubEquations/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Root Equations', function(done) {
    rootEquations.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/rootEquations/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Fractions', function(done) {
    fractions.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/fractions/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Misc Equations', function(done) {
    miscEquations.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/miscEquations/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});

it('Test Advanced Equations', function(done) {
    advancedEquations.forEach(function (eq) {
        let title = getFilename(eq);
        let encodedEquation = encodeURIComponent(eq.latex);
        download('http://localhost/convert?equation=' + encodedEquation + '.png', 'test/sampleOutput/advancedEquations/' + title + '.png', function(){
            console.log('downloaded: ' + title);
        });
    });
    done();
});