document.addEventListener('DOMContentLoaded', function() {
    const todosLink = document.getElementById('todos-link');
    const postsLink = document.getElementById('posts-link');
    const albumsLink = document.getElementById('albums-link');
    const contentSections = document.querySelectorAll('.tab-content');

    // Fungsi untuk menampilkan konten berdasarkan ID
    function showContent(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.getAttribute('id') === sectionId) {
                section.classList.add('active');
            }
        });
    }

    // Event listener untuk link "Todos"
    todosLink.addEventListener('click', function(event) {
        event.preventDefault();
        showContent('todos');
        window.location.href = '/todos';
    });

    // Event listener untuk link "Posts"
    postsLink.addEventListener('click', function(event) {
        event.preventDefault();
        showContent('posts');
        window.location.href = '/posts';
    });

    // Event listener untuk link "Albums"
    albumsLink.addEventListener('click', function(event) {
        event.preventDefault();
        showContent('albums');
        fetchAlbums();
    });

    // Fungsi untuk mengambil dan menampilkan daftar album
    function fetchAlbums() {
        fetch('https://jsonplaceholder.typicode.com/albums')
            .then(response => response.json())
            .then(albums => {
                const albumList = document.getElementById('album-list');
                albumList.innerHTML = ''; // Clear existing album list
                albums.forEach(album => {
                    const listItem = document.createElement('li');
                    const albumLink = document.createElement('a');
                    albumLink.textContent = album.title;
                    albumLink.href = `#/albums/${album.id}`;
                    albumLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        fetchPhotos(album.id);
                        window.history.pushState({}, '', `/albums/${album.id}`);
                    });
                    listItem.appendChild(albumLink);
                    albumList.appendChild(listItem);
                });
            });
    }

    // Fungsi untuk mengambil dan menampilkan foto dari album tertentu berdasarkan ID
    function fetchPhotos(albumId) {
        fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`)
            .then(response => response.json())
            .then(photos => {
                const albumPhotos = document.getElementById('album-photos');
                albumPhotos.innerHTML = ''; // Clear existing photos
                photos.forEach(photo => {
                    const photoContainer = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = photo.thumbnailUrl;
                    img.alt = photo.title;
                    const caption = document.createElement('p');
                    caption.textContent = photo.title;
                    photoContainer.appendChild(img);
                    photoContainer.appendChild(caption);
                    albumPhotos.appendChild(photoContainer);
                });
            });
    }

    // Event listener untuk menangani navigasi browser (back/forward)
    window.addEventListener('popstate', function() {
        const currentPath = window.location.pathname;
        const albumIdMatch = currentPath.match(/\/albums\/(\d+)/);
        if (albumIdMatch) {
            const albumId = albumIdMatch[1];
            showContent('albums');
            fetchPhotos(albumId);
        } else {
            showContent('todos'); // Default to todos or whichever you prefer
        }
    });

    // Handling the initial path when the page is loaded
    const initialPath = window.location.pathname;
    const initialAlbumIdMatch = initialPath.match(/\/albums\/(\d+)/);
    if (initialAlbumIdMatch) {
        const initialAlbumId = initialAlbumIdMatch[1];
        showContent('albums');
        fetchPhotos(initialAlbumId);
    } else {
        showContent('todos'); // Default to todos or whichever you prefer
    }
});
