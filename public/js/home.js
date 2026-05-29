const animeData = [
    {
       title: " With Roommates",
       image: "./images/anime1.png",
       color: "#62109F",
    },

    {
        title: 'Expenses On Trips' ,
        image: './images/anime3.png',
        color: 'blue',
    },

    {
        title: 'Money among Susu Groups' ,
        image: './images/susu.png',
        color: 'red',
    },

    {
        title: 'Expenses With Families' ,
        image:  './images/anime2.png',
        color: '#1DCD9F',
    },

    {
        title: 'Expenses among Groups' ,
       image:  './images/anime4.png',
       color: '#FF6D1F',
    },
    
   {
        title: 'Investments on $tocks' ,
        image: './images/stocks.png',
        color: '#4cd137',
   }
]


let currentIndex = 0;
const animeImage = document.getElementById('heroAnime');
const animeTitle = document.getElementById('animeTitle');

function updateAnime () {
    currentIndex = (currentIndex + 1) % animeData.length;

    animeImage.src = animeData[currentIndex].image;
    animeTitle.textContent = animeData[currentIndex].title;

    animeTitle.style.color = animeData[currentIndex].color;
}

setInterval(updateAnime, 5000);



/*========TRUSTED SECTION===========*/
const track = document.querySelector('.thumbnails-track');
const cards = document.querySelectorAll('.thumbnail');

let index = 0;
let interval;

function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    return 1;
}

const slide = () => {
    const cardsPerView = getCardsPerView();
    const totalCards = cards.length;
    
    // Calculate the maximum index we can slide to
    // If 3 are visible, we can only slide to total - 3
    const maxIndex = totalCards - cardsPerView;

    if (index >= maxIndex) {
        index = 0; // Reset to start
    } else {
        index++;
    }

    const percentageShift = 100 / cardsPerView;
    const moveAmount = index * percentageShift;
    
    track.style.transform = `translateX(-${moveAmount}%)`;
};

const startSlider = () => {
    clearInterval(interval);
    interval = setInterval(slide, 3000);
};

// Initialize
if (track && cards.length) {
    startSlider();

    window.addEventListener('resize', () => {
        index = 0;
        track.style.transform = 'translateX(0)';
        startSlider();
    });
}
