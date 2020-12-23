function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function componentToRgb(c, a=1) {
  var r = parseInt(c.substring(1,3), 16).toString(10);
  var g = parseInt(c.substring(3,5), 16).toString(10);
  var b = parseInt(c.substring(5,), 16).toString(10);
  return `rgba(${r},${g},${b},${a})`
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToComplimentary(hex){

  // Convert hex to rgb
  // Credit to Denis http://stackoverflow.com/a/36253499/4939630
  var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

  // Get array of RGB values
  rgb = rgb.replace(/[^\d,]/g, '').split(',');

  var r = rgb[0], g = rgb[1], b = rgb[2];

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if(max == min) {
      h = s = 0;  //achromatic
  } else {
      var d = max - min;
      s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

      if(max == r && g >= b) {
          h = 1.0472 * (g - b) / d ;
      } else if(max == r && g < b) {
          h = 1.0472 * (g - b) / d + 6.2832;
      } else if(max == g) {
          h = 1.0472 * (b - r) / d + 2.0944;
      } else if(max == b) {
          h = 1.0472 * (r - g) / d + 4.1888;
      }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h+= 180;
  if (h > 360) { h -= 360; }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if(s === 0){
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255); 
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  rgb = b | (g << 8) | (r << 16); 
  return "#" + (0x1000000 | rgb).toString(16).substring(1);
}

function wavelength_to_hex(wavelength, gamma = 0.8) {

  if (wavelength >= 380 & wavelength <= 440) {
    attenuation = 0.3 + 0.7 * (wavelength - 380) / (440 - 380)
    R = ((-(wavelength - 440) / (440 - 380)) * attenuation) ** gamma
    G = 0.0
    B = (1.0 * attenuation) ** gamma
  }
  else if (wavelength >= 440 & wavelength <= 490) {
    R = 0.0
    G = ((wavelength - 440) / (490 - 440)) ** gamma
    B = 1.0
  }
  else if (wavelength >= 490 & wavelength <= 510) {
    R = 0.0
    G = 1.0
    B = (-(wavelength - 510) / (510 - 490)) ** gamma
  }
  else if (wavelength >= 510 & wavelength <= 580) {
    R = ((wavelength - 510) / (580 - 510)) ** gamma
    G = 1.0
    B = 0.0
  }
  else if (wavelength >= 580 & wavelength <= 645) {
    R = 1.0
    G = (-(wavelength - 645) / (645 - 580)) ** gamma
    B = 0.0
  }
  else if (wavelength >= 645 & wavelength <= 750) {
    attenuation = 0.3 + 0.7 * (750 - wavelength) / (750 - 645)
    R = (1.0 * attenuation) ** gamma
    G = 0.0
    B = 0.0
  }
  else {
    R = 0.0
    G = 0.0
    B = 0.0
  }
  R = Math.floor(R * 255)
  G = Math.floor(G * 255)
  B = Math.floor(B * 255)
  return rgbToHex(R, G, B)
}

var slider = document.getElementById('slider-range')
var input = document.getElementById('in')
var text = document.getElementById('cool-text')
var container = document.getElementById('container')

noUiSlider.create(slider, {
  start: [470],
  connect: [true, false],
  step: 1,
  range: {
    'min': [380],
    'max': [700]
  }
})
var toColor = document.querySelector("#slider-range .noUi-base .noUi-connect")

slider.noUiSlider.on('update', function () {
  let wav = slider.noUiSlider.get()
  input.value = Math.trunc(wav)
  let hex = wavelength_to_hex(wav)
  setBodyColour(hex)
  text.style.color = `${hexToComplimentary(hex)}`
  toColor.style.background = hexToComplimentary(hex)
});

function setBodyColour(color) {
  document.body.style.backgroundColor = `${color}`
}

window.addEventListener('load', (event) => {
  let wav = slider.noUiSlider.get()
  input.value = Math.trunc(wav)
  let hex = wavelength_to_hex(wav)
  setBodyColour(hex)
  text.style.color = `${hexToComplimentary(hex)}`
  toColor.style.background = hexToComplimentary(hex)
});


input.addEventListener('focusout', function () {
  slider.noUiSlider.set(input.value)
})

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    slider.noUiSlider.set(input.value)
  }
});