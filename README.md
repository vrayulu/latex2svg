# latex2svg
Node.js service to convert latex equations into svg. This uses [mathjax](https://www.npmjs.com/package/mathjax-full) npm module to convert latex equations to SVG images.

## Build and run the server
- Clone the repository
- Run `npm install` to download the dependencies
- Run `node server.js` to start the server

The server will be running on port 80.

## Usage

Use the following API to convert latex into SVG:

http://localhost/convert?equation=<latex_equation>

**Examples**
- http://localhost/convert?equation=%5Csin%5Ctheta
- http://localhost/convert?equation=x%20%3D%20%5Cfrac%7B-b%5Cpm%5Csqrt%7Bb%5E2-4ac%7D%7D%7B2a%7D
- http://localhost/convert?equation=d%3D%5Csqrt%7B(x_2-x_1)%5E2%2B(y_2-y_1)%5E2%7D

> The above examples have the equations in encoded format so that the URL works when opened in a browser window.

This API can be directly embedded within an _img_ as follows:

```html
<img src="http://localhost/convert?equation=f(x)%3Da_0%2B%5Csum%20_%7Bn%3D1%7D%5E%7B%5Cinfty%20%7D(a_n%5Ccos%20%5Cfrac%7Bn%5CPi%20x%7D%7BL%7D%2Bb_n%5Csin%20%5Cfrac%7Bn%5CPi%20x%7D%7BL%7D)"/>
```

### Convert to PNG

This API can be used to convert latex into PNG image by adding ".png" at the end of the URL.

**Examples**
- http://localhost/convert?equation=%5Csin%5Ctheta.png
- http://localhost/convert?equation=x%20%3D%20%5Cfrac%7B-b%5Cpm%5Csqrt%7Bb%5E2-4ac%7D%7D%7B2a%7D.png
- http://localhost/convert?equation=d%3D%5Csqrt%7B(x_2-x_1)%5E2%2B(y_2-y_1)%5E2%7D.png