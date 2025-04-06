smallImages = document.querySelectorAll(".product__image-small")
smallImages.forEach(image => image.addEventListener("click", (e)=> {

    largeImageContainer = image.closest(".product__image-block").querySelector(".product__image")
    largeImage = largeImageContainer.querySelector("img")
    smallImage = image.querySelector("img").cloneNode(true)


    largeImageContainer.removeChild(largeImage)
    largeImageContainer.appendChild(smallImage)
    console.log(smallImage)
    
    // image.appendChild(smallImage)
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