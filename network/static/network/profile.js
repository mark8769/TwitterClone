$(main);

function main(){
    $("#followButton").click(followHandler);
    $("#unfollowButton").click(followHandler);
}
function followHandler(){
    // Check which button was pressed.
    console.log("inside followHandler");
    // console.log(this.id == "followButton");
    // console.log(this.id);
    if (this.id == "followButton"){
        var shouldFollow = true
    }else{
        var shouldFollow = false
    }
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
            isFollowing: shouldFollow
        }),
        headers: { "X-CSRFToken": csrftoken }
    })
    .then(response => response.json)
    .then(result => {
        // console.log(result);
        if (shouldFollow){
            console.log("hiding stuff");
            $("#follow").attr("hidden", "");
            $("#unfollow").removeAttr("hidden");
        }else{
            console.log("unhiding stuff");
            $("#unfollow").attr("hidden", "");
            $("#follow").removeAttr("hidden");
        }
    });
}