document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryContainer = document.querySelector('.gallery-container');


    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');

    let stackImagesData = []; 
    const stackModal = document.getElementById('stackModal');
    const stackCarouselInner = document.querySelector('.stack-carousel-inner');
    const stackPrevBtn = document.querySelector('.stack-prev-btn');
    const stackNextBtn = document.querySelector('.stack-next-btn');
    const stackDotsContainer = document.getElementById('stackDotsContainer');
    let currentStackIndex = 0;

   
    const photoLightbox = document.getElementById('photoLightbox');
    const lightboxCarouselInner = document.querySelector('.lightbox-carousel-inner');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentPhotoIndex = 0;
    let photoItemsData = []; 


    function createStackDots() {
        if (!stackDotsContainer || !stackCarouselInner || stackImagesData.length === 0) {
            console.warn('createStackDots: Missing elements or no images found for stack.');
            stackDotsContainer.innerHTML = '';
            stackCarouselInner.style.width = '100%';
            return;
        }

        stackCarouselInner.innerHTML = ''; 
        stackImagesData.forEach(src => {
            const img = document.createElement('img');
            img.classList.add('stack-img');
            img.src = src;
            img.alt = 'Stacked Image';
            stackCarouselInner.appendChild(img);
        });

        stackCarouselInner.style.width = `${stackImagesData.length * 100}%`;
        stackDotsContainer.innerHTML = '';
        stackImagesData.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('stack-dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                currentStackIndex = i;
                showStackImage(currentStackIndex);
            });
            stackDotsContainer.appendChild(dot);
        });
    }

    function showStackImage(index) {
        if (!stackImagesData || stackImagesData.length === 0 || !stackCarouselInner) {
            console.warn('showStackImage: stackImagesData or stackCarouselInner is not defined or empty.');
            return;
        }

        currentStackIndex = (index + stackImagesData.length) % stackImagesData.length;
        stackCarouselInner.style.transform = `translateX(${-currentStackIndex * 100}%)`;

        const dots = stackDotsContainer.querySelectorAll('.stack-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentStackIndex) {
                dot.classList.add('active');
            }
        });
    }

  
    function showPhoto(index) {
        if (!photoItemsData || photoItemsData.length === 0 || !lightboxCarouselInner) {
            console.warn('showPhoto: photoItemsData or lightboxCarouselInner is not defined or empty.');
            return;
        }

        currentPhotoIndex = (index + photoItemsData.length) % photoItemsData.length;
        lightboxCarouselInner.style.transform = `translateX(${-currentPhotoIndex * 100}%)`;
    }

  
    async function fetchMedia() {
        try {
            const response = await fetch('media.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const mediaData = await response.json();
            renderMediaItems(mediaData);
        } catch (error) {
            console.error('Error fetching media items:', error);
            galleryContainer.innerHTML = '<p style="color: white; text-align: center;">Failed to load media. Please try again later.</p>';
        }
    }

    function renderMediaItems(mediaData) {
        galleryContainer.innerHTML = ''; 

        mediaData.forEach(item => {
            const mediaItemDiv = document.createElement('div');
            mediaItemDiv.classList.add('media-item');
            mediaItemDiv.dataset.type = item.type;
            mediaItemDiv.dataset.id = item.id;

            if (item.type === 'photo') {
                mediaItemDiv.classList.add('photo');
                mediaItemDiv.dataset.src = item.file_path; 
                mediaItemDiv.innerHTML = `
                    <img src="${item.file_path}" alt="${item.title}">
                    <div class="media-title">${item.title}</div>
                `;
            } else if (item.type === 'video') {
                mediaItemDiv.classList.add('video');
                mediaItemDiv.innerHTML = `
                    <video preload="metadata" poster="${item.thumbnail_path || ''}">
                        <source src="${item.file_path}" type="video/mp4">
                    </video>
                    <div class="play-overlay">▶</div>
                    <div class="media-title">${item.title}</div>
                `;
            } else if (item.type === 'stack') {
                mediaItemDiv.classList.add('stack');
                
                mediaItemDiv.dataset.stackImages = JSON.stringify(item.file_paths);

                const previewImagesHtml = item.file_paths.slice(0, 3).map((src, index) =>
                    `<img src="${src}" alt="Stacked Image ${index + 1}">`
                ).join('');

                mediaItemDiv.innerHTML = `
                    <div class="stack-preview">
                        ${previewImagesHtml}
                        <span>+ More</span>
                    </div>
                    <div class="media-title">${item.title}</div>
                `;
            }
            galleryContainer.appendChild(mediaItemDiv);
        });

 
        const mediaItems = document.querySelectorAll('.gallery-container .media-item');
        attachEventListeners(mediaItems); 
        updatePhotoItemsData(); 
    }

    
    function updatePhotoItemsData() {
        photoItemsData = Array.from(document.querySelectorAll('.media-item.photo:not(.hidden)'))
                            .map(item => ({
                                src: item.dataset.src,
                                alt: item.querySelector('img').alt
                            }));
    }

    
    function attachEventListeners(mediaItems) {
        mediaItems.forEach(item => {
            
            if (item.classList.contains('video')) {
                item.addEventListener('click', () => {
                    const videoSource = item.querySelector('source').src;
                    modalVideo.src = videoSource;
                    videoModal.classList.add('active');
                    modalVideo.play();
                });
            }

            if (item.classList.contains('stack')) {
                item.addEventListener('click', () => {
                    
                    stackImagesData = JSON.parse(item.dataset.stackImages);
                    stackModal.classList.add('active');
                    createStackDots();
                    showStackImage(0);
                });
            }

            
            if (item.classList.contains('photo') && !item.classList.contains('stack')) {
                item.addEventListener('click', () => {
                    lightboxCarouselInner.innerHTML = ''; 

                    photoItemsData.forEach(photo => {
                        const img = document.createElement('img');
                        img.src = photo.src;
                        img.alt = photo.alt;
                        lightboxCarouselInner.appendChild(img);
                    });

                    lightboxCarouselInner.style.width = `${photoItemsData.length * 100}%`;

                    const clickedSrc = item.dataset.src;
                    currentPhotoIndex = photoItemsData.findIndex(photo => photo.src === clickedSrc);

                    if (currentPhotoIndex !== -1) {
                        photoLightbox.classList.add('active');
                        showPhoto(currentPhotoIndex);
                    }
                });
            }
        });
    }

  
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            document.querySelectorAll('.gallery-container .media-item').forEach(item => {
                const itemType = item.dataset.type;
                if (filter === 'all' || itemType === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            updatePhotoItemsData(); 
        });
    });

    
    if (stackPrevBtn) {
        stackPrevBtn.addEventListener('click', () => {
            showStackImage(currentStackIndex - 1);
        });
    }
    if (stackNextBtn) {
        stackNextBtn.addEventListener('click', () => {
            showStackImage(currentStackIndex + 1);
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPhoto(currentPhotoIndex - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showPhoto(currentPhotoIndex + 1);
        });
    }

    
    const allCloseButtons = document.querySelectorAll('.modal .close-btn');
    allCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (videoModal.classList.contains('active')) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
                videoModal.classList.remove('active');
            }
            if (stackModal.classList.contains('active')) {
                stackModal.classList.remove('active');
                if (stackDotsContainer) stackDotsContainer.innerHTML = '';
                if (stackCarouselInner) stackCarouselInner.style.transform = `translateX(0)`;
            }
            if (photoLightbox.classList.contains('active')) {
                photoLightbox.classList.remove('active');
                if (lightboxCarouselInner) lightboxCarouselInner.innerHTML = '';
                if (lightboxCarouselInner) lightboxCarouselInner.style.transform = `translateX(0)`;
            }
        });
    });

    
    window.addEventListener('click', (event) => {
        if (event.target === videoModal) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
            videoModal.classList.remove('active');
        }
        if (event.target === stackModal) {
            stackModal.classList.remove('active');
            if (stackDotsContainer) stackDotsContainer.innerHTML = '';
            if (stackCarouselInner) stackCarouselInner.style.transform = `translateX(0)`;
        }
        if (event.target === photoLightbox) {
            photoLightbox.classList.remove('active');
            if (lightboxCarouselInner) lightboxCarouselInner.innerHTML = '';
            if (lightboxCarouselInner) lightboxCarouselInner.style.transform = `translateX(0)`;
        }
    });

    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (videoModal.classList.contains('active')) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
                videoModal.classList.remove('active');
            }
            if (stackModal.classList.contains('active')) {
                stackModal.classList.remove('active');
                if (stackDotsContainer) stackDotsContainer.innerHTML = '';
                if (stackCarouselInner) stackCarouselInner.style.transform = `translateX(0)`;
            }
            if (photoLightbox.classList.contains('active')) {
                photoLightbox.classList.remove('active');
                if (lightboxCarouselInner) lightboxCarouselInner.innerHTML = '';
                if (lightboxCarouselInner) lightboxCarouselInner.style.transform = `translateX(0)`;
            }
        } else if (event.key === 'ArrowLeft') {
            if (photoLightbox.classList.contains('active')) {
                showPhoto(currentPhotoIndex - 1);
            } else if (stackModal.classList.contains('active')) {
                showStackImage(currentStackIndex - 1);
            }
        } else if (event.key === 'ArrowRight') {
            if (photoLightbox.classList.contains('active')) {
                showPhoto(currentPhotoIndex + 1);
            } else if (stackModal.classList.contains('active')) {
                showStackImage(currentStackIndex + 1);
            }
        }
    });

   
    fetchMedia();
});