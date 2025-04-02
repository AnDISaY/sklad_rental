smallImages = document.querySelectorAll(".product__image-small")
console.log("bebebe")
smallImages.forEach(image => image.addEventListener("click", (e)=> {
    console.log("bobobo")

    largeImageContainer = image.closest(".product__image-block").querySelector(".product__image")
    largeImage = largeImageContainer.querySelector("img")
    smallImage = image.querySelector("img")

    console.log(smallImage)
    console.log(image)

    largeImageContainer.removeChild(largeImage)
    largeImageContainer.appendChild(smallImage)

    // image.removeChild(smallImage)
    image.appendChild(largeImage)
}))


    
function reloadProductScript() {
    let oldScript = document.querySelector("#productScript");
    if (oldScript) {
        oldScript.remove(oldScript); // Remove the old script
    }
    smallImages.forEach(image => image.replaceWith(image.cloneNode(true)))

    let newScript = document.createElement("script");
    newScript.src = `/static/js/productImage.js`;
    newScript.id = "productScript";
    newScript.type = "text/javascript";
    document.body.appendChild(newScript);
}