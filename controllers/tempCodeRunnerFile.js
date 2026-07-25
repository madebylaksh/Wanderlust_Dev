let category = "LAJSDASJK DASJX ZXzxcnjzn nzxkj najskdnc jkzxn nsd sdncjvn k";
category = category.toLowerCase().split(" ").map(e=> e.trim()[0].toUpperCase() + e.slice(1)).join(" ");
console.log(category);