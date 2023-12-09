const chickenJokes = [
    "Why did the chicken join a band? Because it had the drumsticks!",
    "Why did the chicken go to school? To get a better peck-tion.",
    "Why did the turkey join the chicken band? To be the drumstick!",
    "Why did the chicken join the library? Because it wanted book-bawk!",
    "What do you call a chicken in a shell suit? An egg.",
    "Why did the rubber chicken cross the road? To stretch its legs.",
    "Why did the chicken sit on the egg? It didn't want to lay down on the job.",
    "What do chicken families do on Saturday afternoon? They go on peck-nics!",
    "Why did the chicken go to KFC? To see its relatives.",
    "Why did the chicken join the circus? Because it was a crackling performer!"
];

const jokeExplanations = [
    "It's a play on words, as drumsticks are both a part of a chicken and an instrument used in a band.",
    "A pun on the word 'education' and the chicken's action of pecking.",
    "Drumsticks are again associated with chickens, but this time a turkey is playing on that association.",
    "'Book-bawk' sounds like the noise a chicken makes (bawk) and also relates to books in a library.",
    "An egg is essentially a chicken in a shell, and a 'suit' plays on the protective layer.",
    "A play on the classic joke but with a 'rubber chicken', which is a comedic prop.",
    "A humorous way to say the chicken is keeping the egg warm by sitting on it.",
    "A play on the word 'picnics' and the chicken's action of pecking.",
    "A humorous and slightly dark twist implying the chicken's relatives are being served at KFC.",
    "The word 'crackling' is associated with the sound chicken makes and implies an outstanding performance."
];

let currentJokeIndex = -1;  // To track the currently shown joke.

function displayJoke() {
    // Get a random joke index
    currentJokeIndex = Math.floor(Math.random() * chickenJokes.length);
    document.getElementById("joke").innerText = chickenJokes[currentJokeIndex];
    document.getElementById("explanation").innerText = "";  // Reset the explanation
}

function displayExplanation() {
    if (currentJokeIndex != -1) {  // Check if a joke is currently displayed
        document.getElementById("explanation").innerText = jokeExplanations[currentJokeIndex];
    }
}

const totalImages = 61;  // Total number of chicken images downloaded

function generateGallery() {
    let galleryHTML = '<h2>Chicken Gallery</h2><div class="image-container">';

    for (let i = 1; i <= totalImages; i++) {
        galleryHTML += `<img src="chicken_images/chicken_${i}.jpg" alt="Chicken Image ${i}">`;
    }

    galleryHTML += '</div>';

    document.getElementById("gallery").innerHTML = galleryHTML;

    // Add click event to images
    const images = document.querySelectorAll('.image-container img');
    images.forEach(img => {
        img.addEventListener('click', function() {
            openModal(this);
        });
    });
}

let isAnimating = false; // A flag to track if an animation is currently running

function openModal(imgElement) {
    if (isAnimating) return; // If an animation is running, don't do anything
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('caption');
    
    modal.style.display = "block";
    modalImg.src = imgElement.src;
    caption.innerHTML = imgElement.alt;

    // Remove any existing fadeOut animation class
    modal.classList.remove('fadeOutAnimation');

    // Set the animation flag
    isAnimating = true;
    modal.addEventListener('animationend', function() {
        isAnimating = false; // Reset the flag when the animation completes
        modal.addEventListener('click', closeModal);
    }, {once: true});
}


function closeModal() {
    if (isAnimating) return; // If an animation is running, don't do anything

    const modal = document.getElementById('imageModal');
    
    // Set the animation flag
    isAnimating = true;
    
    // Add fadeOut animation class
    modal.classList.add('fadeOutAnimation');
    
    // Wait for the animation to complete then hide the modal
    modal.addEventListener('animationend', function() {
        modal.style.display = "none";
        modal.classList.remove('fadeOutAnimation');
        isAnimating = false; // Reset the flag when the animation completes
    }, {once: true});
}


window.onload = generateGallery;  // Generate the gallery when the page loads

