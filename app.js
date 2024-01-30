const DEFAULT_WIDTH = 480


function handleFile() {
    const file = fileIn.files[0]

    if (file.type.startsWith("image/")) {
        handleImage(file)
    }
    else if (file.type.startsWith("video/")) {
        handleVideo(file)
    }
    else {
        handleElse()
    }
}

function handleImage(file) {
    // Get the contents
    const frame = document.createElement("canvas");
    const context = frame.getContext("2d")
    display.innerHTML = ""
    
    // 
    const reader = new FileReader()
    reader.onload = e => {
        
        const image = new Image()
        image.onload = () => {
            
            // If too large, will break the viewer
            const width = Math.min(DEFAULT_WIDTH, image.width) * getWidthMultiplier()
            const height = Math.floor(width * image.height / image.width)
            console.log(width, height)
            
            frame.width = width
            frame.height= height
            context.drawImage(image, 0, 0, width, height) // Extra params are for result height and width, which would also require adjustments to the frame size
            
            const imgData = context.getImageData(0,0, frame.width, frame.height).data
            const aggrData = aggregateData(imgData)
            const rgbData = aggrData

            // Aggregated rgb into ascii

            // Get ascii array aggregate
            const ascii = lumiToAscii(rgbData)
            console.log(ascii)

            // Present on the html
            displayImg(ascii, frame.width)
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(file)
}

function getWidthMultiplier() {
    const val = document.getElementById("pixel-count").valueAsNumber
    let multiplier = 1
    if (!isNaN(val)) {
        multiplier = val
    }
    return multiplier
}

function adjustDisplaySize() {
    const val = document.getElementById("char-size").value
    let size = "3"
    if (val != "") {
        size = val
    }
    display.style.fontSize = size + "px"
}

// Input is an array of 
function aggregateData(imgData) {
    const rgbData = []

    // Image to greyscale/aggregate rgb
    for (let i = 0; i < imgData.length; i += 4) {
        let r = imgData[i]
        let g = imgData[i+1]
        let b = imgData[i+2]
        // rgbData.push([r,g,b])
        rgbData.push(getLumins(r,g,b))
    }

    return rgbData
}

function lumiToAscii(data) {
    const gscale = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~>>i!lI;:,\"^`'.."
    // Having < and > as possible characters meant a string could possibly deliminate itself, essentially removing a few chars
    const res = []

    for (let i = 0; i < data.length; i+= 1) {
        const index = Math.floor(data[i] * (gscale.length - 1) / 255)
        const val = gscale[ index ]
        res.push(val)
    }
    return res
}

// Math from https://marmelab.com/blog/2018/02/20/convert-image-to-ascii-art-masterpiece.html 
function getLumins(r, g, b) {
    return 0.21 * r + 0.72 * g + 0.07 * b
}

function handleVideo(file) {
    const blob = URL.createObjectURL(file)
    var width = DEFAULT_WIDTH, height = DEFAULT_WIDTH * 9/16

    const frame = document.createElement("canvas");
    const context = frame.getContext("2d")

    const video = document.createElement("video")
    video.onloadedmetadata = function () {
        video.play()
        width = Math.min(DEFAULT_WIDTH, video.videoWidth) * getWidthMultiplier()
        height = Math.floor(width * video.videoHeight / video.videoWidth)
        frame.width = width
        frame.height= height
    }
    
    // Function to draw whatever the current frame the video is at
    var _drawFrame = function (e) {
        context.drawImage(video, 0, 0, width, height)

        // From frame, get image pixels, aggregate to rgb, them convert to ascii list
        const imgData = context.getImageData(0,0, frame.width, frame.height).data
        const rgbData = aggregateData(imgData)
        const ascii = lumiToAscii(rgbData)

        // Present on the html
        displayImg(ascii, frame.width)
    }
    // Each time video frame is prompted, draw the frame
    video.onseeked = _drawFrame
    video.src = blob
    // Draws frames in accordance to browser frame rate
    function repeatFrame() {
        _drawFrame()
        requestAnimationFrame(repeatFrame)
    }
    repeatFrame()
}

function handleElse() {
    console.log("Other file")
    display.style.fontSize = "1em"
    display.innerHTML = "An incompatible file has been uploaded, please try something else"
}

// Input of an array of greyscale characters
function displayImg(content, width) {
    display.innerHTML = ""
    let output = ""
    for (let i = 0; i < content.length; i++) {
        output += content[i]
        
        if ((i+1) % width == 0 && i != 0) {
            const para = document.createElement("p")
            para.innerHTML = output
            display.append(para)
            output = ""
        }
        else {
            // output += " " // monospace chars have 1:2 width:height ratio, so this is filler
            output += content[i]
        }
    }
    adjustDisplaySize()
}

const fileIn = document.getElementById("file-in")
const display = document.getElementById("display")
fileIn.addEventListener("change", handleFile)
document.getElementById("button-a").onclick = handleFile
document.getElementById("redraw").onclick = handleFile