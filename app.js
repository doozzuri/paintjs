const $canvas = document.querySelector("#jsCanvas")
const ctx = $canvas.getContext("2d")
const $colors = document.querySelectorAll(".jsColor")
const $range = document.querySelector("#jsRange")
const $mode = document.querySelector("#jsMode")
const $save = document.querySelector("#jsSave")
const $clear = document.querySelector("#jsClear")
const colorList = Array.from($colors)

const INITIAL_COLOR = "#2c2c2c"
const CANVAS_SIZE = 500
const CHECKED_IMG = '✔'

//setting 
$canvas.width = CANVAS_SIZE
$canvas.height = CANVAS_SIZE
let painting = false
let filling = false
onClear()

function onClear(){
    ctx.fillStyle= "white"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.strokeStyle = INITIAL_COLOR
    ctx.fillStyle = INITIAL_COLOR
    ctx.lineWidth = 2.5

    painting = false
    filling = false
    $mode.innerText = "FILL"
    $range.value = 2.5
    colorList.forEach(color => color.innerText = (color.style.backgroundColor === 'rgb(44, 44, 44)' ?CHECKED_IMG:''))    
}

function startPainting(){
    if(filling){
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    }else{
        painting = true
    }
}
function stopPainting(){
    if(!filling){
        painting = false
    }
}

function onMousemove(e){
    if(filling) return false
    const x = e.offsetX
    const y = e.offsetY
    if(!painting){
        ctx.beginPath()
        ctx.moveTo(x,y)
    }else{
        ctx.lineTo(x,y)
        ctx.stroke()
    }
}

function startTouchPainting(e){
    onTouchmove(e)
    if(filling){
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    }else{
        painting = true
    }
}
function stopTouchPainting(){
    if(!filling){
        painting = false
    }
}

function onTouchmove(e){
    e.preventDefault()
    if(filling) return false
    const touches = e.changedTouches
    const rect = e.target.getBoundingClientRect();
    const x = touches[0].clientX - rect.left
    const y = touches[0].clientY - rect.top
    if(painting){
        ctx.lineTo(x,y)
        ctx.stroke()
    }else{
        ctx.beginPath()
        ctx.moveTo(x,y)
    }
}

if($canvas) {
    $canvas.addEventListener("mousedown", startPainting)
    $canvas.addEventListener("mousemove", onMousemove)
    $canvas.addEventListener("mouseup", stopPainting)
    $canvas.addEventListener("mouseleave", stopPainting)
    $canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault()
    })

    $canvas.addEventListener("touchstart", startTouchPainting)
    $canvas.addEventListener("touchmove", onTouchmove)
    $canvas.addEventListener("touchend",stopTouchPainting)
}

colorList.forEach(color => color.addEventListener("click", (e) => {
    colorList.forEach(color => color.innerText = '')
    e.target.innerText = CHECKED_IMG
    const color = e.target.style.backgroundColor
    ctx.strokeStyle = color
    ctx.fillStyle = color
}))

if($range){
    $range.addEventListener("input", (e) => {
        const size = e.target.value
        ctx.lineWidth = size
    })
}

if($mode){
    $mode.addEventListener("click", (e) =>{
        if(filling){
            filling = false
            $mode.innerText = "FILL"
        }else{
            filling = true
            $mode.innerText = "PAINT"
        }
    })
}

if($save){
    $save.addEventListener("click", () =>{
        const yesOrNo = confirm("저장하시겠습니까?")
        if(yesOrNo){
            const image = $canvas.toDataURL()
            const $link = document.createElement("a")
            $link.href = image
            $link.download = "paintJS[EXPORT]"
            $link.click()
        }
    })
}

if($clear){
    $clear.addEventListener("click", onClear)
}