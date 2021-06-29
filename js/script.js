//----------------------------------------------------------------
//                      Global Variables
//----------------------------------------------------------------


let profiles;
let index = 0;


//----------------------------------------------------------------
//                         FETCH CALL
//----------------------------------------------------------------


//url given a query String (?results=12&nat=us) to receive 12 employees form the us 
fetchData('https://randomuser.me/api/?results=12&nat=us');


//----------------------------------------------------------------------------------------------------------------------
//                                              HELPER FUNCTIONS
//----------------------------------------------------------------------------------------------------------------------

/**
 * async function to house all formatting to be done to the data received and when the fetch call needs to be made this function can be re-used
 * @param {url} will be passed in when the fetch call happens
 */

async function fetchData(url) {

    const response = await fetch(url);

    //fetch will always pass and fail silently so this method handles if an error occurs
    checkStatus(response);

    const data = await response.json();
    profiles = data.results;

    createGalleryMarkUp(data.results);
    showModal(profiles);
    getMatches();

}

/**
 * @param {response}
 * @check the response data from the fetch request and create a conditional to check if the response is positive (resolve) or a negative (reject) and handle the reject and resolve messages based on outcome or else the fetch request fill fail silently  
 */
function checkStatus(response) {

    if (response) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }

}

function createGalleryMarkUp(data) {

    /** 
     * @map result data from the api fetch so that all the employees can be appended to the DOM
     * 
     * @NB add data-index-number to the gallery markup so you can target the index of the specific gallery employee item so that you use that information to create a modal template for that specific employee when clicked 
     */

    const html = data.map((item) => {
        return `<div class="card" data-index-number=${data.indexOf(item)}>
                    <div class="card-img-container" data-index-number=${data.indexOf(item)}>
                        <img class="card-img" src="${item.picture.large}" alt="profile picture" data-index-number=${data.indexOf(item)}>
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

    //format the phone number so that the correct formatting is displayed in the modal
    const phoneNum = data.phone.replace(/[-]/, ' ');

    //template literal modal markup template
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
                                <p class="modal-text">Birthday: ${data.dob.date.slice(5,7)}/${data.dob.date.slice(8,10,)}/${data.dob.date.slice(0,4)}</p>
                            </div>
                        </div>
                        <div class="modal-btn-container">
                            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                            <button type="button" id="modal-next" class="modal-next btn">Next</button>
                        </div>
                    </div>
                    `;

    //append the card modal template literal mark up to the DOM
    document.querySelector('#gallery').insertAdjacentHTML('afterend', cards);

    //create variables needed to perform tasks

    const next = document.querySelector('#modal-next');
    const prev = document.querySelector('#modal-prev');
    const close = document.querySelector('.modal-close-btn');
    const body = document.querySelector('body');
    const currentModal = document.querySelector('.modal-container');
    const cardSet = document.querySelectorAll('.card');

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
     * create a click event listener to show the next employees modal when the next button is clicked
     * @showNextModal {following element child} remove current modal and display the next element modal when the next button is clicked by increasing the index global variable by 1
     * and passing the profiles global variable with the new index to the modalMarkUp function to create the next modal
     *  
     * @if {index} === the last employees index remove the next button since no employee is next in line.
     */

    next.addEventListener('click', () => {
        // debugger
        if (index < cardSet.length - 1) {

            body.removeChild(currentModal);
            index = +index + 1;

            modalMarkUp(profiles[index]);
            // console.log(index);

        }
        if (index === cardSet.length - 1) {
            next.style.display = 'none';
        }
    })

    /**
     * create a click event listener to show the previous employees modal when the previous button is clicked
     * @showPreviousModal {previous element child} remove current modal and display the previous element modal when the previous button is clicked by decreasing the index global variable by 1
     * and passing the profiles global variable with the new index to the modalMarkUp function to create the previous modal
     * 
     * @if {index} === the first employees index remove the previous button since no employee comes before the 0th index
     */

    prev.addEventListener('click', () => {
        // debugger
        if (index > 0) {

            body.removeChild(currentModal);
            index = +index - 1;

            modalMarkUp(profiles[index]);
            // console.log(index);

        }

    })

    //removes the previous and next button based on tbe index position/value of the modal displayed
    if (index === 0) {
        prev.style.display = 'none';
    } else if (index === cardSet.length - 1) {
        next.style.display = 'none';
    }
}

/**
 * function to display the modal to the DOM
 * @byGiving all the card elements on the page a click event listener
 * and remove the next and previous button elements on click if the employee that is clicked has a index of 0 (remove previous button)
 * else if index of clicked employee === 11 or the last employee (remove next button)
 */

function showModal(data) {

    const cardSet = document.querySelectorAll('.card');
    const container = document.querySelector('.modal-container');

    for (let i = 0; i < cardSet.length; i++) {
        cardSet[i].addEventListener('click', (event) => {

            index = parseInt(event.target.dataset.indexNumber);
            // console.log(index);
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


//----------------------------------------------------------------------------------------------------------------------
//                                                       Search Bar
//----------------------------------------------------------------------------------------------------------------------


/**
 * create the HTML mark up so that the search bar is displayed on the page
 * with the correct css addition and formatting
 */

const searchDiv = document.querySelector('.search-container');
const searchHtml = ` <form action = "#" method = "get">
                        <input type = "search" id = "search-input" class = "search-input" placeholder = "Search...">
                        <input type = "submit" value = "&#x1F50D;" id = "search-submit" class = "search-submit">
                    </form>
                    `;

//Insert the search HTML mark up to the DOM
searchDiv.insertAdjacentHTML('beforeend', searchHtml);

/**
 * @function retrieve the employees that match the data typed into the search bar and stores it into a variable to dynamically 
 * add the matched elements to the page 
 * perform this within a keyup event listener for in real time filtering
 * 
 * @if there are no matches insert 'Results haven't been found' to the DOM and remove all employees 
 * @else remove current gallery employees and add new filtered employees to the DOM
 */

function getMatches() {

    document.querySelector('.search-input').addEventListener('keyup', (event) => {
        let returnArr = [];
        let matchIndex = [];

        event.preventDefault();
        // console.log(event.target.value)
        profiles.forEach((pro) => {
            // console.log(pro.name.first, pro.name.last)
            if (pro.name.first.toLowerCase().includes(event.target.value.toLowerCase()) || pro.name.last.toLowerCase().includes(event.target.value.toLowerCase())) {
                returnArr.push(pro)
                matchIndex.push(profiles.indexOf(pro))
            }

        })

        // console.log(matchIndex)

        if (returnArr.length === 0) {
            document.querySelector('.gallery').innerHTML = '<h3>No Results Have Been Found</h3>';
        };
        if (returnArr.length > 0) {
            document.querySelector('.gallery').innerHTML = '';

            createGalleryMarkUp(returnArr);
            showModal(returnArr)
        }
    })

    document.querySelector('.search-submit').addEventListener('click', (event) => {
        let returnArr = [];

        event.preventDefault();
        // console.log(event.target.value)
        profiles.forEach((pro) => {
            // console.log(pro.name.first, pro.name.last)
            if (pro.name.first.toLowerCase().includes(event.target.value.toLowerCase()) || pro.name.last.toLowerCase().includes(event.target.value.toLowerCase())) {
                returnArr.push(pro)
            }

        })

        if (returnArr.length === 0) {
            document.querySelector('.gallery').innerHTML = '<h3>No Results Have Been Found</h3>';
        };
        if (returnArr.length > 0) {
            document.querySelector('.gallery').innerHTML = '';
            createGalleryMarkUp(returnArr);
            showModal(returnArr);
        }
    })

}