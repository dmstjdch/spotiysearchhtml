async function searchSpotify() {
    const searchInput = document.getElementById("searchInput").value;
    const resultContainer = document.getElementById("resultContainer");
    const albumCover = document.getElementById("albumCover");
    const songTitle = document.getElementById("songTitle");
    const artistName = document.getElementById("artistName");
    const audioPlayer = document.getElementById("audioPlayer");

    try {
        const response = await fetch('/getAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const accessToken = data.accessToken;

        const apiUrl = `https://api.spotify.com/v1/search?q=${searchInput}&type=track&limit=10`;
        const apiResponse = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const searchData = await apiResponse.json();
        const tracks = searchData.tracks.items;

        if (tracks.length > 0) {
            // Display the first result
            const firstTrack = tracks[0];
            albumCover.src = firstTrack.album.images[0].url;
            songTitle.textContent = firstTrack.name;
            artistName.textContent = firstTrack.artists[0].name;

            songTitle.addEventListener('click', () => {
                redirectToSpotify(firstTrack.external_urls.spotify);
            });

            artistName.addEventListener('click', () => {
                redirectToSpotify(firstTrack.artists[0].external_urls.spotify);
            });
			
            audioPlayer.src = firstTrack.preview_url;
            resultContainer.classList.remove("hidden");

            // Display the additional results
            const similarResultsContainer = document.getElementById("similarResultsContainer");
            similarResultsContainer.innerHTML = ""; // Clear previous results

            for (let i = 1; i < tracks.length; i++) {
                const track = tracks[i];
                const resultItem = document.createElement("div");
                resultItem.classList.add("resultItem");

                resultItem.innerHTML = `
                    <img src="${track.album.images[0].url}" alt="Album Cover" class="resultItemCover">
                    <p class="resultItemTitle">${track.name}</p>
                    <p class="resultItemArtist">${track.artists[0].name}</p>
                `;

                resultItem.addEventListener('click', () => {
                    redirectToSpotify(track.external_urls.spotify);
                });

                similarResultsContainer.appendChild(resultItem);
            }
        } else {
            alert("No results found");
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching data. Please try again later.');
    }
}

function redirectToSpotify(url) {
    window.location.href = url;
}

function stopPreview() {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.pause();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchSpotify();
    }
}