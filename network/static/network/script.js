$(main);

function main(){
    loadPosts();
    addEventListeners();

}
function loadPosts(){
    getPosts();
}
function addEventListeners(){
    $("#postButton").click(postHandler);
}
function profileHandler(){
    console.log("clicked on profile");
    window.open("http://localhost:8000/profile", target="_self");
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
function addPostHandlers(){
    $(".user").click(profileHandler);
}
function displayPosts(posts){
    console.log("displaying all posts");
    let $homePage = $("#all-posts-view");
    let htmlBuilder = '';
    // console.log(posts);
    posts.forEach(element => {
        let user = `<div class="user" id=${element.username}>${element.username}</div>`;
        let datetime = `<div>${element.datetime}</div>`;
        let content = `<div>${element.content}</div>`;
        let build = user + datetime + content;
        htmlBuilder += `<div>${build}</div>`;
        console.log(element);
    });
    $homePage.html(htmlBuilder);
    addPostHandlers();
}
function getPosts(){
    console.log("getting all posts");
    fetch("/post")
    .then(response => response.json())
    .then(results => {
        // console.log(results);
        displayPosts(results);
    })
}