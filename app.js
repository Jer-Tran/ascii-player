
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
            // Get image rgb value
            const imgData = context.getImageData(0,0, frame.width, frame.height).data
            // console.log(imgData)
            const rgbData = []

            // Image to greyscale/aggregate rgb
            for (let i = 0; i < imgData.length; i += 4) {
                let r = imgData[i]
                let g = imgData[i+1]
                let b = imgData[i+2]
                rgbData.push([r,g,b])
            }
            console.log(rgbData)

            // Aggregated rgb into ascii

            // Get ascii array aggregate

            // Present on the html
            displayImg(frame)
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(file)
}

function handleVideo(file) {
    console.log("video")
    display.innerHTML = "Videos upload detected - Work in progress"
}

function handleElse() {
    console.log("Other file")
    display.innerHTML = "An incompatible file has been uploaded, please try something else"
}

function displayImg(content) {
    display.append(content)
}

const fileIn = document.getElementById("file-in")
const display = document.getElementById("display")
fileIn.addEventListener("change", handleFile)
document.getElementById("button-a").onclick = handleFile
document.getElementById("button-b").onclick = displayImg