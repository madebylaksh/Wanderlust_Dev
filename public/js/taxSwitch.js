const taxSwitch = document.querySelector(".taxToggle input");
const taxInfoTags = document.querySelectorAll("#tax-info");

taxSwitch.addEventListener("change", ()=>{
    for (let tag of taxInfoTags) {
        if (taxSwitch.checked) {
            tag.hidden = false;
        }
        else {
            tag.hidden = true;
        }
    }
})  