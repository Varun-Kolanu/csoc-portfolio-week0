const client_id = '31ab7bd2d0c2473c93d8c54fec334da5';
const userId = '313apiitplczopvlclvusxbntoha'
// const redirect_uri = 'http://127.0.0.1:5501/dist/Spotify.html';
const redirect_uri = 'https://varun-kolanu-portfolio-csoc.netlify.app/dist/Spotify.html';
let myName = "";
let noOfPlaylists = 0;
let followers = 0;
let openProfileUrl = "";
let profileImgUrl = "";
let alternatePlaylists = {
    "items": [
        {
            "external_urls": { "spotify": "https://open.spotify.com/playlist/0idyE9WLzj9tO8GIm7reZ9" },
            "images": [
                {
                    "url": "../src/Images/shershaah.jpg"
                }
            ],
            "name": "Hindi Songs"
        },
        {
            "external_urls": { "spotify": "https://open.spotify.com/playlist/1rwaYzMEa69dDOkvsEj5b4" },
            "images": [
                {
                    "url": "../src/Images/sitaramam.jpg"
                }
            ],
            "name": "Telugu Songs"
        },
        {
            "external_urls": { "spotify": "https://open.spotify.com/playlist/1DUuGhlopPhrzEHDSGaooJ" },
            "images": [
                {
                    "url": "../src/Images/krishna.jpg"
                }
            ],
            "name": "Devotional Songs"
        }
    ]
}
let playlists = {}

const profileImageDom = document.getElementById("profileImage")
const myNameDom = document.getElementById("myName")
const noOfPlaylistsDom = document.getElementById("noOfPlaylists")
const followersDom = document.getElementById("followers")
const openProfileDom = document.getElementById("openProfile")
const playlistCardsDom = document.getElementById("playlistCards")

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(code_verifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}

const refreshToken = async () => {
    const refresh_response = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: sessionStorage.refresh_token,
            client_id,
        })
    })
    const refresh_json = await refresh_response.json();
    sessionStorage.setItem('access_token', refresh_json.access_token)
    sessionStorage.setItem('refresh_token', refresh_json.refresh_token)
}

const userProfile = async () => {
    let response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.access_token
        }
    });
    if (response.status === 401) {
        refreshToken();
        response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.access_token
            }
        });
    }
    if (response.status === 200) {
        const responseJson = await response.json();
        myName = responseJson.display_name;
        followers = responseJson.followers.total
        openProfileUrl = responseJson.external_urls.spotify
        profileImgUrl = responseJson.images[0].url

        myNameDom.innerText = myName
        followersDom.innerText = followers + ' ' + "followers"
        openProfileDom.href = openProfileUrl
        profileImageDom.style = `background-image: url('${profileImgUrl}');`
    }
}

const myPlaylists = async () => {
    let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.access_token
        }
    });
    if (response.status === 401) {
        refreshToken();
        response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.access_token
            }
        });
    }
    if (response.status === 200) {
        const responseJson = await response.json();
        playlists = responseJson;
    }
    else if (response.status === 403) {
        //* User Not registered in the developer dashboard
        playlists = alternatePlaylists;
    }
    
    noOfPlaylists = playlists.items.length
    noOfPlaylistsDom.innerText = noOfPlaylists + ' ' + 'Public Playlists';

    playlists.items.forEach(playlist => {
        playlistCardsDom.innerHTML += `<div class="cursor-pointer w-[200px] h-[250px] m-3 flex items-center rounded-xl flex-col shadow-xl shadow-black bg-[#4d51bc]">
            <div style="background-image: url('${playlist.images[0].url}');" class="playlistImg hover:scale-105 transition-all duration-500 bg-center bg-cover w-[170px] h-[170px] mt-3 rounded-lg"></div>
            <span class="text-xl text-[#f6ba74] font-semibold">${playlist.name}</span>
            <a href="${playlist.external_urls.spotify}" target="_blank" class="text-[#22ff72] underline">Open Playlist</a>
        </div>`
    })
}


if (!sessionStorage.getItem('code_verifier')) {
    const code_verifier = generateRandomString(128);

    generateCodeChallenge(code_verifier).then(code_challenge => {
        const state = generateRandomString(16);
        // const scope = 'playlist-read-private playlist-read-collaborative';

        sessionStorage.setItem('code_verifier', code_verifier);

        const args = new URLSearchParams({
            response_type: 'code',
            client_id,
            redirect_uri,
            state,
            code_challenge_method: 'S256',
            code_challenge
        });

        window.location = 'https://accounts.spotify.com/authorize?' + args;
    });

}
else {
    if (!sessionStorage.getItem('access_token')) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const code_verifier = sessionStorage.getItem('code_verifier');

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            client_id,
            code_verifier
        });

        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                sessionStorage.setItem('access_token', data.access_token);
                sessionStorage.setItem('refresh_token', data.refresh_token);
                userProfile();
                myPlaylists();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else {
        userProfile();
        myPlaylists();
    }
}

