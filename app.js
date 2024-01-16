
function prepFile() {
    const file = fileIn.files[0]

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        return;
    }
    console.log(file)
    display.innerHTML = file.name + " " + file.size + " " + file.type + "<br>"
    const img = document.createElement("img"); // Probably not needed once I get converting to ascii, unless there's some way to present ascii in an image
    img.classList.add("obj")
    img.file = file
    display.append(img)

    const reader = new FileReader()
    reader.onload = (e) => {
        img.src = e.target.result;
    }
    reader.readAsDataURL(file)
}

function displayImg() {
    display.append( Math.floor(Math.random() * 10) ) // Filler content that adds to the display
}

const fileIn = document.getElementById("file-in")
const display = document.getElementById("display")
fileIn.addEventListener("change", prepFile)
document.getElementById("button-a").onclick = prepFile
document.getElementById("button-b").onclick = displayImg