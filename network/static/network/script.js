$(main);

function main(){
    console.log("Hello");
    addEventListeners();

}
function loadPosts(){

}

function addEventListeners(){
    $("#postButton").click(postHandler);
}

// Pass in user, pass in postContent for fetch request.
function postHandler(){
    // Why do some elements let you access via html, and some through html?
    console.log("Pressed post button");
    console.log($("#postContent").val());
    // possibility of someone editing the username in developer tools and creating a post for them.
    //console.log($("#username").html());
    // Maybe access the above inside the python code.....
    let csrftoken = Cookies.get('csrftoken');
    console.log(csrftoken)
    // https://stackoverflow.com/questions/43606056/proper-django-csrf-validation-using-fetch-post-request
    fetch("/post",{
        method: "POST",
        body: JSON.stringify({
            "postContent": $("#postContent").val()
        }),
        headers: { "X-CSRFToken": csrftoken }
    })
    .then(response => console.log(response))
    // .then(result => console.log(result))
}

function getPosts(){
    fetch("/post")
    .then(response => response.json)
    .then(result => console.log(result))
}