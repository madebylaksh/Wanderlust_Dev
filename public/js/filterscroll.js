const filters = document.getElementById("filters");

document.getElementById("filter-left").addEventListener("click", ()=> {
    filters.scrollBy({left: -300, behavior: "smooth"});
})

document.getElementById("filter-right").addEventListener("click", ()=> {
    filters.scrollBy({left: 300, behavior: "smooth"});
})