let array = [];

while (array.length < 12) {
    const data = fetch('https://randomuser.me/api/')
        .then(response => response.json())
        .then(data => array.push(data));
}

console.log(Promise.all(array))
console.log(array)
document.querySelector('#gallery').innerHTML;