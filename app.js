
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
    const img = document.createElement("img"); // Probably not needed once I get converting to ascii, unless there's some way to present ascii in an image
    img.classList.add("obj")
    img.file = file

    // Image to greyscale/aggregate rgb

    // Aggregated rgb into ascii

    // Get ascii array aggregate
    const reader = new FileReader()
    console.log(reader)
    reader.onload = (e) => {
        img.src = e.target.result;
    }
    console.log(reader)
    reader.readAsDataURL(file)
    console.log(reader)

    // Present on the html
    displayImg(img)
    console.log(reader.result)
    display.append(reader.result)
}
// Goal right now is to restructure and generally have an idea for how code will progress, DO NOT COMMIT UNTIL this part is completed

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