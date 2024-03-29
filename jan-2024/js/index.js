// user id 587326588086124585

window.onload = async () => {
    Particles.init({
        selector: '.background',
        connectParticles: true,
        color: "#fcfcfc",
        sizeVariations: 5,
      });
    let response = await fetch("https://api.lanyard.rest/v1/users/587326588086124585");
    response = await response.json();
    let data = response.data;
    console.log(data);
    let avatar_url = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=512`;
    // pfp element
    let pfp_el = document.getElementById("profile-picture");
    pfp_el.src = avatar_url;
    console.log(data)
    document.getElementById("username").innerHTML = data.discord_user.username;
    switch (data.discord_status) {
        case "online":
            // green
            pfp_el.style.borderColor = "#43b581";
            break;
        case "dnd":
            // red
            pfp_el.style.borderColor = "#f04747";
            break;
        case "idle":
            pfp_el.style.borderColor = "yellow";
            break;
        case "offline":
            pfp_el.style.borderColor = "gray";
            break;
    }

    if (data.spotify) {
        console.log(data.spotify);
        document.getElementById("large-img").src = data.spotify.album_art_url;
        document.getElementById("activity-name").innerHTML = data.spotify.song;
        document.getElementById("activity-text").innerHTML = "by " + data.spotify.artist;
    } else if(data.activities) {
        try {
            let activity_data = data.activities[data.activities.length - 1];
            let now = Date.now();
            let elapsed_time_ms = now - activity_data.timestamps.start;
            let elapsed_time = new Date(elapsed_time_ms);
            let hours = elapsed_time.getUTCHours().toString();
            let minutes = elapsed_time.getUTCMinutes().toString().padStart(2, '0');
            let seconds = elapsed_time.getUTCSeconds().toString().padStart(2, '0');
            let formated_time;
            if (hours == "0") {
                formated_time = `${minutes}:${seconds}`;
            } else {
                formated_time = `${hours}:${minutes}:${seconds}`;
            }
            // shoot me
            let status_text = "";
            if (activity_data.state) {
                status_text += activity_data.state + "\n";
            }
            if (activity_data.details) {
                status_text += activity_data.details + "\n";
            }
            if (formated_time) {
                status_text += formated_time + " elapsed";
            }
            let large_img = "https://cdn.discordapp.com/app-assets/383226320970055681/";
            let small_img = "https://cdn.discordapp.com/app-assets/383226320970055681/";
            try {
                large_img += activity_data.assets.large_image + ".png";
                small_img += activity_data.assets.small_image + ".png";

            } catch {
                large_img = "./icons/missing-activity.svg";
                small_img = "";
            }
            console.log(activity_data);
            console.log(activity_data.name);
            document.getElementById("activity-name").innerText = activity_data.name;
            document.getElementById("activity-text").innerText = status_text;
            document.getElementById("large-img").src = large_img;
            document.getElementById("small-img").src = small_img;
        } catch {
            document.getElementById("activity-name").innerText = "Sleeping";
            document.getElementById("activity-text").innerText = "For once\nzzz";
            document.getElementById("activity-img-wrapper").remove();
            document.getElementById("text-wrap").style.marginLeft = "2em";
        }
    }
}