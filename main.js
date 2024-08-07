let drpDown = document.getElementById('drpdown');
let cancel = document.getElementById('cancel');
let menu = document.getElementById('menu');

const drpD = () => {
    drpDown.style.width = '75vw';
    drpDown.style.padding = '20px'
    menu.style.cssText = 'display : none !important ;'
    cancel.style.cssText = 'display : block !important ;'
};

const drpU = () => {
    drpDown.style.width = '0px';
    drpDown.style.padding = '0px'
    menu.style.cssText = 'display : block !important ;'
    cancel.style.cssText = 'display : none !important ;'
};



document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const trail = document.querySelector('.custom-cursor-trail');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function animateTrail() {
        requestAnimationFrame(animateTrail);

        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
    }

    animateTrail();

    document.addEventListener('click', () => {
        cursor.classList.add('click');
        setTimeout(() => {
            cursor.classList.remove('click');
        }, 150); // 150ms is the duration of the animation
    });
});


const dropdowns = document.querySelectorAll('.dropdown');

            dropdowns.forEach(dropdown => {
                let timeout;

                dropdown.addEventListener('mouseenter', function() {
                    clearTimeout(timeout);
                    this.querySelector('.dropdown-content').style.display = 'grid';
                });

                dropdown.addEventListener('mouseleave', function() {
                    const dropdownContent = this.querySelector('.dropdown-content');
                    timeout = setTimeout(() => {
                        dropdownContent.style.display = 'none';
                    }, 600); 
                });

                dropdown.querySelector('.dropdown-content').addEventListener('mouseenter', function() {
                    clearTimeout(timeout);
                });

                dropdown.querySelector('.dropdown-content').addEventListener('mouseleave', function() {
                    this.style.display = 'none';
                });
});

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) { // Adjust this value based on when you want the color to change
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function dialNumber(number) {
    window.location.href = `tel:${number}`;
}

function contact(){
    location.href = 'contact';
}

function abtUs(){
    location.href = 'aboutUs';
}

function sendEmail() {
    const recipient = "admin@e4healthcare.info";
    const subject = "Inquiry";
    const body = "Dear e4Healthcare,";

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

let arrow = document.getElementById('arrow');

function drpdrp() {
    const drpbtn = document.getElementById('drpdrp');

    if (drpbtn.style.height === '0px' || drpbtn.style.height === '') {
        drpbtn.style.display = 'grid';
        drpbtn.style.height = '300px';
        arrow.style.cssText = 'transform : rotate(180deg) !important ;'
    } else {
        drpbtn.style.height = '0px';
        arrow.style.cssText = 'transform : rotate(360deg) !important ;'
    }
}

