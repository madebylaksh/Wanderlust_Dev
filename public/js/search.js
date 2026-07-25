const searchBar = document.querySelector("#search-bar");
const suggestionBox = document.querySelector(".suggestions");

document.addEventListener("click",(event)=> {
    if (!searchBar.contains(event.target) && !suggestionBox.contains(event.target)) {
        suggestionBox.style.display = "none";
    }
    else if (searchBar.value.trim()!==""){                      // if bar is empty no need to display sBox
        suggestionBox.style.display = "block";
    }
})




// debouncing
let timer;
searchBar.addEventListener("input", (event)=> {
    const query = event.target.value.trim();
    if (query==="") {
        suggestionBox.style.display = "none";
        clearTimeout(timer);
        return;
    }   
    clearTimeout(timer);
    timer = setTimeout(async ()=> {
        const response = await fetch("/listings/search/suggestions?search=" + query);
        const data = await response.json();
        suggestionBox.innerHTML = "";
        if (data.length!==0) {
            suggestionBox.style.display = "block"; 
        }
        else {
            suggestionBox.style.display = "none";
        }
        for (let value of data) {
            const a = document.createElement("a");
            a.classList.add("suggestion");
            a.href = `/listings/${value._id}`;
            a.innerHTML = `<i class="fa-brands fa-sistrix me-3"></i>${value.title}<br><span class="suggestion-details">${value.location}, ${value.country}</span>`;
            suggestionBox.appendChild(a);
        }
    }, 300);
});