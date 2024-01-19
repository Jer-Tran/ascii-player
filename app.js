
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
    console.log(file)
    display.innerHTML = file.name + " " + file.size + " " + file.type + "<br>"
    // Currently puts image in container and place it in display div
    const frame = document.createElement("canvas"); // Probably not needed once I get converting to ascii, unless there's some way to present ascii in an image
    const context = frame.getContext("2d")
    
    // 
    const reader = new FileReader()
    reader.onload = e => {
        
        const image = new Image()
        image.onload = () => {
            
            frame.width = image.width
            frame.height= image.height
            context.drawImage(image, 0, 0)
            
            const imgData = context.getImageData(0,0, frame.width, frame.height).data
            const rgbData = aggregateData(imgData)
            console.log(rgbData)

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
    console.log("video")
    display.innerHTML = "Videos upload detected - Work in progress"
}

function handleElse() {
    console.log("Other file")
    display.innerHTML = "An incompatible file has been uploaded, please try something else"
}

// Input of an array of greyscale characters
function displayImg(content, width) {
    let output = ""
    for (let i = 0; i < content.length; i++) {
        output += content[i]
        if ((i+1) % width == 0 && i != 0) {
            const para = document.createElement("p")
            para.innerHTML = output
            display.append(para)
            output = ""
        }
    }
}

const fileIn = document.getElementById("file-in")
const display = document.getElementById("display")
fileIn.addEventListener("change", handleFile)
document.getElementById("button-a").onclick = handleFile
document.getElementById("button-b").onclick = displayImg