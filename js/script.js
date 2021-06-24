let profiles;
let index = 0;

//FETCH CALL

fetchData('https://randomuser.me/api/?results=12&nat=us');



//----------------------------------------------------------------------------------------------
//HELPER FUNCTIONS
async function fetchData(url) {
    const response = await fetch(url);
    //fetch will always pass and fail silently so this method handles if an error occurs
    checkStatus(response);

    const data = await response.json();
    profiles = data.results;
    createGalleryMarkUp(data.results);
    showModal(profiles);
}

function checkStatus(response) {
    if (response) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function createGalleryMarkUp(data) {

    /** 
     * add data-index-number to the gallery markup so you can target the index of the specific gallery employee item so that you use that information to create a modal template for that specific employee when clicked 
     */

    const html = data.map((item) => {
        return `<div class="card" data-index-number=${data.indexOf(item)}>
                    <div class="card-img-container" data-index-number=${data.indexOf(item)}>
                        <img class="card-img" src="${item.picture.medium}" alt="profile picture" data-index-number=${data.indexOf(item)}>
                    </div>
                    <div class="card-info-container" data-index-number=${data.indexOf(item)}>
                        <h3 id="name" class="card-name cap" data-index-number=${data.indexOf(item)}>${item.name.first} ${item.name.last}</h3>
                        <p class="card-text" data-index-number=${data.indexOf(item)}>${item.email}</p>
                        <p class="card-text cap" data-index-number=${data.indexOf(item)}>${item.location.city}, ${item.location.state}</p>
                    </div>
                </div>
                `;
    })
    document.querySelector('#gallery').insertAdjacentHTML('beforeend', html.join(''));
}

function modalMarkUp(data) {

    const phoneNum = data.phone.replace(/[-]/, ' ');

    const cards = `<div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src="${data.picture.large}" alt="profile picture">
                                <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
                                <p class="modal-text">Email: ${data.email}</p>
                                <p class="modal-text cap">City: ${data.location.city}</p>
                                <hr>
                                <p class="modal-text">Phone: ${phoneNum}</p>
                                <p class="modal-text">Location: ${data.location.street.number} ${data.location.street.name} ${data.location.city} ${data.location.state}</p>
                                <p class="modal-text">Birthday: ${data.dob.date.slice(8,10,)}/${data.dob.date.slice(5,7)}/${data.dob.date.slice(0,4)}</p>
                            </div>
                        </div>
                        <div class="modal-btn-container">
                            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                            <button type="button" id="modal-next" class="modal-next btn">Next</button>
                        </div>
                    </div>
                    `;

    document.querySelector('#gallery').insertAdjacentHTML('afterend', cards);

    const next = document.querySelector('#modal-next');
    const prev = document.querySelector('#modal-prev');
    const close = document.querySelector('.modal-close-btn');
    const body = document.querySelector('body');
    const currentModal = document.querySelector('.modal-container');

    /**
     * create a event listener to close the modal when the close ( X ) button is clicked
     * @removeChild  {modal div} from the page so it isn't within user view anymore 
     */

    close.addEventListener('click', () => {
        const body = document.querySelector('body');
        const divModalContainer = document.querySelector('.modal-container');
        body.removeChild(divModalContainer);
    })

    /**
     * create a event listener to show the next employees modal when the next button is clicked
     * @showNextModal {following element child} display the next element
     */

    next.addEventListener('click', () => {

        if (index < 11) {

            body.removeChild(currentModal);
            let nextEmp = +index + 1;
            modalMarkUp(profiles[nextEmp]);
            index = nextEmp;
            console.log(index);

        } else if (index === 11) {
            next.style.display = 'none';
        }

    })

    prev.addEventListener('click', () => {

        if (index > 0) {

            body.removeChild(currentModal);
            let previous = +index - 1;
            modalMarkUp(profiles[previous]);
            index = previous;
            console.log(index);

        } else if (index === 0) {
            prev.style.display = 'none';
        }

    })
}

function showModal(data) {

    const cardSet = document.querySelectorAll('.card');
    const container = document.querySelector('.modal-container');

    for (let i = 0; i < cardSet.length; i++) {
        cardSet[i].addEventListener('click', (event) => {
            index = parseInt(event.target.dataset.indexNumber);
            console.log(index);
            modalMarkUp(data[index]);
            if (index === 0) {
                const prevBtn = document.querySelector('.modal-prev');
                prevBtn.style.display = 'none';
                console.log('beginning');
            } else if (index === 11) {
                const nextBtn = document.querySelector('.modal-next');
                nextBtn.style.display = 'none';
                console.log('end');
            }
        })
    }

}





//----------------
//   Search Bar
//----------------

// let profileArr = [];
// console.log(profileArr)

const searchDiv = document.querySelector('.search-container');
const searchHtml = ` <form action = "#" method = "get">
                        <input type = "search" id = "search-input" class = "search-input" placeholder = "Search...">
                        <input type = "submit" value = "&#x1F50D;" id = "search-submit" class = "search-submit">
                    </form>
                    `;
searchDiv.insertAdjacentHTML('beforeend', searchHtml);

// function getMatches() {

//     let returnArr = [];
//     event.preventDefault();
//     profileArr.forEach((name) => {
//         if (name.toLowerCase().includes(event.target.value)) returnArr.push(name);
//     })
//     if (returnArr.length === 0) {

//     }
// }

// const searchInput = document.querySelector('#search-input');
// searchInput.addEventListener('keyup', (event) => {
//     getMatches()
// })