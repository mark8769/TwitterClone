$(main);

function main(){
    $("#followButton").click(follow);
}
function follow(){
    let username = $("#username").html();
    let urlName = document.URL;
    let splitUrl = urlName.split("/");
    // let user = splitUrl[splitUrl.length - 1];
    let user = splitUrl.at(-1); // Bringing love to python.
    console.log(user);
    let endpoint = `http://localhost:8000/follow/${username}`;
    let csrftoken = Cookies.get("csrftoken")
    console.log("following " + username)

    fetch(endpoint,{
        method: "PUT",
        body: JSON.stringify({
            isFollowing: true
        }),
        headers: { "X-CSRFToken": csrftoken }
    })
    .then(response => response.json)
    .then(result => console.log(result))
}