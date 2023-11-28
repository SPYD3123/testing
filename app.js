const Defaultr = 51;
const Defaultg = 51;
const Defaultb = 51;
const Defaultcolor = `rgb(${Defaultr},${Defaultg},${Defaultb})`
const Defaultpenmode = 'color'
const Defaultsize = 125;
const Defaultpentype = '';
const Defaultgridmode = 'plane';
const DefaultAnimation = 'off';


let r=Defaultr;
let b=Defaultb;
let g=Defaultg;
let currentsize = Defaultsize;
let currentcolor = Defaultcolor;
let currentpenmode = Defaultpenmode;
let currentpentype = Defaultpentype;
let currentgridmode = Defaultgridmode;
let currentAnimation = DefaultAnimation;

const sliderEl = document.querySelector("#range2");
const sliderValue = document.querySelector(".value2");
const colorbutton=document.getElementById('colorbutton')
const rainbowbutton=document.getElementById('rainbow')
const shadebutton=document.getElementById('shade')
const erasebutton=document.getElementById('erase')
const colorpicker=document.getElementById('colorpicker')
const clearbutton=document.getElementById('clears')
const patternbutton=document.getElementById('pattern')
const animationbutton=document.getElementById('animations')
const pentypebutton=document.getElementById('pentype')


pentypebutton.addEventListener('change',changepentype)
animationbutton.addEventListener('change',onoffanimations)
patternbutton.addEventListener('change',changepattern)
clearbutton.addEventListener('click',clear)
sliderEl.addEventListener("input",slidervaluechange);
colorbutton.addEventListener('click',changemodebtn);
rainbowbutton.addEventListener('click',changemodebtn);
shadebutton.addEventListener('click',changemodebtn);
erasebutton.addEventListener('click',changemodebtn);
colorpicker.addEventListener('input',updatecolor)


function changecurrentpentype(value){
    currentpentype=value;
}

function changeanimation(value){
    currentAnimation=value;
}
function patternchange(value){
    currentgridmode=value;
}

function updatesizevalue(value){
    currentsize=value;
}
function updatemode(value){
    currentpenmode=value;
}
function updatecolor(e){
    let tempcolor=e.target.value;
    r = parseInt(tempcolor.slice(1, 3), 16);
    g = parseInt(tempcolor.slice(3, 5), 16);
    b = parseInt(tempcolor.slice(5, 7), 16);
    currentcolor=`rgb(${r},${g},${b})`;
}

const grid = document.querySelector('.mid');

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)





// ... (your existing code)

let touchHoldTimer;

function creategrid() {
    grid.style.cssText = `grid-template-columns:repeat(${currentsize},auto);`
    for (let i = 0; i < currentsize * currentsize; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tiles');
        tile.addEventListener('mouseover', changecolor);
        tile.addEventListener('touchstart', handleTouchStart);
        tile.addEventListener('touchend', handleTouchEnd);
        tile.addEventListener('touchmove', handleTouchMove);
        tile.addEventListener('dragstart', (e) => e.preventDefault());
        grid.appendChild(tile);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    if (currentpentype === 'hover') {
        changecolor(e);
    } else if (currentpentype === 'drag') {
        touchHoldTimer = setTimeout(() => {
            mouseDown = true;
            changecolor(e);
        }, 500); // Set your desired hold duration
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    clearTimeout(touchHoldTimer);
    if (currentpentype === 'drag' && mouseDown) {
        mouseDown = false;
        // Additional logic if needed
    }
}

function handleTouchMove(e) {
    e.preventDefault();

    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (targetElement && targetElement.classList.contains('tiles')) {
        changecolor({ target: targetElement });
    }
}

// ... (your existing code)




function changecolor(e) {
    if (currentpentype == 'drag') {
        if (e.type === 'mouseover' && !mouseDown) return
    }
    if (currentpenmode == 'color') {
        animation(e);
        e.target.style.backgroundColor = currentcolor;
    }
    else if (currentpenmode == 'rainbow') {
        animation(e);
        let rr = Math.floor(Math.random() * 255);
        let gr = Math.floor(Math.random() * 255);
        let br = Math.floor(Math.random() * 255);
        e.target.style.backgroundColor = `rgb(${rr},${gr},${br})`
    }
    else if (currentpenmode == 'grayscale') {
        animation(e);
        
        if (e.target.style.backgroundColor.match(new RegExp(`rgba\\(${r}, ${g}, ${b}`))) {
            let currentOpacity = Number(e.target.style.backgroundColor.slice(-4, -1));
            if (currentOpacity <= 0.96 ) {
                e.target.style.backgroundColor = `rgba(${r},${g},${b}, ${currentOpacity + 0.12})`;
                e.target.classList.add('gray');
            }
        } else {
            if (e.target.style.backgroundColor == `rgb(${r}, ${g}, ${b})` &&
                (e.target.classList[1] == 'gray' || e.target.classList[2] == 'gray')) {
                e.target.style.backgroundColor = `rgb(${r},${g},${b})`;
            } else {
                e.target.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.12)`;
            }
        }
    }

    else if (currentpenmode == 'erase') {
        // e.target.classList.remove
        animation(e);
        e.target.style.backgroundColor = 'rgb(255,255,255)';
    }
}

function clear() {
    grid.innerHTML = ''
    creategrid();
    pattern();
}

function pattern() {
    if (currentgridmode == 'patterned') {
        grid.style.borderRight='none'
        grid.style.borderTop='none'
        grid.style.borderLeft='1px solid gray'
        grid.style.borderBottom='1px solid gray'
        let tiles = document.querySelectorAll('.tiles')
        tiles.forEach(tile => {
            tile.classList.add('borders')
        });
    }
    else if (currentgridmode == 'plane') {
        grid.style.borderLeft='none'
        grid.style.borderBottom='none'
        let tiles = document.querySelectorAll('.tiles')
        tiles.forEach(tile => {
            tile.classList.remove('borders')
        });
    }
}

function animation(e) {
    if (currentAnimation == 'on') {
        e.target.style.transition = 'all 0.8s';
    }
}


creategrid();
pattern();
changepentype({ target: { checked:pentypebutton.checked } });
onoffanimations({ target: { checked:animationbutton.checked } });
changepattern({ target: { checked:patternbutton.checked } });





slidervaluechange({ target: { value: sliderEl.value } });

function slidervaluechange(event){
    const tempSliderValue = event.target.value;

  sliderValue.textContent = `${tempSliderValue}x${tempSliderValue}` ;
  updatesizevalue(tempSliderValue)
  clear()
  const progress = (tempSliderValue / sliderEl.max) * 100;

  // Set the background color to black
  sliderEl.style.background = `linear-gradient(to right, #000 ${progress}%, #ccc ${progress}%)`;
}

function changemodebtn(e){
    colorbutton.classList.remove('btnactive')
    shadebutton.classList.remove('btnactive')
    rainbowbutton.classList.remove('btnactive')
    erasebutton.classList.remove('btnactive')
    e.target.classList.add('btnactive')
    updatemode(e.target.value);
}

function changepattern(e){
    if (e.target.checked) {
        patternchange('patterned');
    }
    else{
        patternchange('plane')
    }
    pattern();
}

function onoffanimations(e){
    if (e.target.checked) {
        changeanimation('on')
    }
    else{
        changeanimation('off')
    }


}


function changepentype(e){
    if (e.target.checked) {
        changecurrentpentype('drag')
    }
    else{
        changecurrentpentype('hover')
    }
}

