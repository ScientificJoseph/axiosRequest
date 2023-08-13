const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) { // data parameter added for POST
    // const promise = new Promise((resolve, reject) => {
    // xhr.setRequestHeader('Content-Type', 'applicatio/json'); //used to send additional header information along with the data being posted
//     const xhr = new XMLHttpRequest(); // Object that allow for sending HTTP request. Built into the browser
//     xhr.open(method, url); //initializes a newly-created request, or re-initializes an existing one.
//     xhr.responseType = 'json' //Parses (converts JSON data to String data) behind the scenes 
//     xhr.onload = function() {
//         if (xhr.status >= 200 && xhr.status < 300) { // reports non success status code
//             resolve(xhr.response) // on completion, resolve returns the array of users objects retrieved from the API
//             // const listOfPost = JSON.parse(xhr.response); //converts retrieved API JSON object into text format that JS can use
//         } else {
                // xhr.response // yields addition error information
//             reject(new Error('Something is a bit off...'))
//         }
// }
// xhr.onerror = function() { // server non success status code does not make it into onerror. you stay in onload
//     reject(new Error('Failed to send request...'))
// }
// xhr.send(JSON.stringify(data)); // sends the request to the server. stringify converts object in createPOST to JSON string
        
    // });
//  return promise;
    return fetch(url, {// fetch is a Promise by default. sends POST request for response object. object parameter configures request
        method: method, // GET is default. for posting set to POST (method value received from method parameter in sendHttpRequest)
        body: JSON.stringify(data), // stringifies data being POST to server. (data received from data parameter in sendHttpRequest)
        // body: data, // added for passing html form data to server - stringifies data being POST to server. (data received from data parameter in sendHttpRequest)
        headers: { //used to send additional header information along with the data being posted to server
            'Content-Type': 'application/json' // identifies to the server that this is json data
        }
    })
        .then(response => { //outter promise chain
            if (response.status >= 200 && response.status < 300) {
                return response.json(); //yields a new promise. parses the response fron json to javascript ready object
            } else { // else case for error handling
                return response.json() // needed for parsing data for else case / error handling
                .then(errData => { // yields a promise // inner merged with outer promised chain
                    console.log(errData) // accesses error response body
                    throw new Error('Something is a bit off - Server Side...')
                });
            }
        }) 
        .catch(error => {
            console.log('catch',error);
            throw new Error('Something is a bit off...')
        })
}

async function fetchPosts() {
    try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts'); // no need to receive GET. replaced call to sendHttpRequest. data is Parsed on retrieval
    console.log(response)
    const listOfPost = response.data; // assigns retrieved API data to list of post. data is a field (property) of the response object retrieved 
    for(const post of listOfPost) { // iterates through retrieved objects and returns API data 
        const postEl = document.importNode(postTemplate.content, true); //makes a deep clone of template element where retrieved API data will appear
        postEl.querySelector('h2').textContent = post.title.toUpperCase(); // sets the h2 tags text content to that of the objects title property value 
        postEl.querySelector('p').textContent = post.body; // sets the p tags text content to that of the objects body property value 
        postEl.querySelector('li').id = post.id; // assigns is to every li element
        listElement.append(postEl); // appends the list item to the unordered list
    }

} catch(error) {
        alert(error.message)
        console.log(error.response)
    }
}

async function createPost(title, content) {
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: userId
    }

    const fd = new FormData(form); // added for using html form data format - form  recieed from html form input
    // // fd.append('title', title)
    // // fd.append('body', content)
    fd.append('userId', userId)

    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', fd) //axiom - stringifies / convertsdata adds header info
    // pass fd hear if using html form data format to pass to server
    console.log(response)
}

fetchButton.addEventListener('click', fetchPosts)

form.addEventListener('submit', event => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;
    if(enteredTitle === '' || enteredContent === ''){
        alert('Fil out the form')
        return
    }
    createPost(enteredTitle, enteredContent)
    form.reset()
})

postList.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        const li = event.target.closest('li')
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        console.log(li, postId)
        li.remove()
    }
})





