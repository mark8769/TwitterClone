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
    $("#following").click(getFollowing);
}
function profileHandler(){
    console.log("clicked on profile");
    window.open(`http://localhost:8000/profile/${this.id}`, target="_self");
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
    .then(response => {
        // I think something is being returned here bedcause following code does not work outside of then.
        console.log(response);
        getPosts();
        $("#postContent").val("");
    });
    // .then(result => console.log(result))
}
function addPostHandlers(){
    $(".user").click(profileHandler);
    // $("#username").click(profileHandler);
    $(".button-container > .like").click(like);
    $(".button-container > .dislike").click(dislike);
}
function like(){
    console.log('like button clicked');
    let parentButtonContainer = this.parentNode;
    let post_id = parentButtonContainer.id;
    let csrftoken = Cookies.get('csrftoken');
    fetch(`http://localhost:8000/like/${post_id}`,{
        "method":"PUT",
        "body": JSON.stringify({
            "like_state": true
        }),
        headers: { "X-CSRFToken": csrftoken }
    })
    .then(console.log("like sent to server"))
}
function dislike(){
    console.log("dislike button clicked");
    let parentButtonContainer = this.parentNode;
    let post_id = parentButtonContainer.id;
    let csrftoken = Cookies.get('csrftoken');
    fetch(`http://localhost:8000/dislike/${post_id}`,{
        "method":"PUT",
        "body": JSON.stringify({
            "like_state": false
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(console.log("dislike sent to server"))
}
function displayPosts(posts){
    console.log("displaying all posts");
    let $homePage = $("#all-posts-view");
    $homePage.html("");
    let htmlBuilder = '';
    // console.log(posts);
    posts.forEach(element => {
        let user = `<div class="user" id=${element.username}>${element.username}</div>`;
        let datetime = `<div>${element.datetime}</div>`;
        let content = `<div>${element.content}</div>`;
        let buttonContainer = `<div class='button-container' id=${element.id}>`;
        let button = "<button class='like'>Like</button>";
        let dbutton = "<button class='dislike'>Dislike</button>"
        let closeButtonContainer = "</div>"
        let cont = buttonContainer + button + dbutton + closeButtonContainer;
        let build = user + datetime + content + cont;
        htmlBuilder += `<div>${build}</div>`;
        // console.log(element);
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
function getFollowing(){
    console.log("getting all following posts");
    fetch("/following")
    .then(response => response.json())
    .then(results => {
        // console.log(results)
        displayPosts(results);
    })
}