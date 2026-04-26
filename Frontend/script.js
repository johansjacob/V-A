// --- 1. Loading Screen Logic ---
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('main-invite').classList.remove('hidden');
        }, 500);
    }, 1500); // Fakes a 1.5 second loading time
};

// --- 2. Countdown Timer Logic ---
// Set wedding date (November 2, 2026, 17:00:00)
const weddingDate = new Date("November 2, 2026 17:00:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) return; // Stop if date passed

    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("mins").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById("secs").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
}, 1000);

// --- 3. RSVP Flow Logic ---
let guestCount = 1;

function showGuestCount() {
    document.getElementById('rsvp-step-1').classList.add('hidden');
    document.getElementById('rsvp-step-2').classList.remove('hidden');
    
    // Tiny confetti pop on clicking Yes
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 }, colors: ['#6D8B74', '#E6E2D6'] });
}

function updateCount(change) {
    guestCount += change;
    if (guestCount < 1) guestCount = 1; // Minimum 1 guest
    if (guestCount > 10) guestCount = 10; // Maximum 10 guests
    document.getElementById('guest-count').innerText = guestCount;
}

function submitRSVP() {
    document.getElementById('rsvp-step-2').classList.add('hidden');
    document.getElementById('rsvp-success').classList.remove('hidden');
    
    // Big confetti celebration on submit!
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#6D8B74', '#D4AF37', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#6D8B74', '#D4AF37', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function submitNo() {
    document.getElementById('rsvp-step-1').classList.add('hidden');
    const successSection = document.getElementById('rsvp-success');
    successSection.classList.remove('hidden');
    
    // Change text for a "No" response
    successSection.innerHTML = `
        <h3 class="wonderful-text" style="color: #a94442;">We'll miss you!</h3>
        <p class="guest-name">${primaryName}</p>
        <p class="success-msg">Thank you for letting us know. You will be missed!</p>
    `;
}

// --- 4. Subtle Floating Background Effect ---

function createBackgroundHeart() {
    const heart = document.createElement('div');
    heart.classList.add('background-heart');
    
    // The emojis that will float up
    const emojis = ['❤️']; 
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Pick a random horizontal spot on the screen (0% to 100% width)
    heart.style.left = Math.random() * 100 + 'vw';
    
    // Pick a random speed between 6 and 12 seconds so it feels natural
    const floatDuration = Math.random() * 6 + 5;
    heart.style.animationDuration = floatDuration + 's';

    // Add it to the page
    document.body.appendChild(heart);

    // Clean up: Remove the heart once it floats off the screen
    setTimeout(() => {
        heart.remove();
    }, floatDuration * 1000);
}

// Generate one heart every 2000 milliseconds (2 seconds)
// Increase this number (e.g., 3000) for fewer hearts, or decrease (1000) for more.
setInterval(createBackgroundHeart, 2000);

function showGuestCount() {
    // 1. Grab the name they typed
    const primaryName = document.getElementById('primary-guest-name').value.trim();
    
    // 2. Make sure they didn't leave it blank
    if (!primaryName) {
        const inputField = document.getElementById('primary-guest-name');
        inputField.style.borderColor = 'red';
        setTimeout(() => inputField.style.borderColor = 'var(--border-color)', 1500);
        return; 
    }

    // 3. Inject their name into the Step 2 box
    // If you want it to say "DETAILS FOR SARAH", keep the "DETAILS FOR" text.
    // If you want JUST their name, change it to: = primaryName.toUpperCase();
    document.getElementById('details-for-name').innerText = `DETAILS FOR ${primaryName.toUpperCase()}`;

    // 4. Move to Step 2
    document.getElementById('rsvp-step-1').classList.add('hidden');
    document.getElementById('rsvp-step-2').classList.remove('hidden');
    
    // Little confetti pop!
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 }, colors: ['#6D8B74', '#E6E2D6'] });
}

// Function to update the number without creating extra input boxes
function updateCount(change) {
    guestCount += change;
    if (guestCount < 1) guestCount = 1;
    if (guestCount > 10) guestCount = 10;
    document.getElementById('guest-count').innerText = guestCount;
    
    // We removed the code that adds extra <input> tags here
}

async function submitRSVP() {
    const primaryName = document.getElementById('primary-guest-name').value.trim();

    // Prepare data: Only Primary Name and Total Count
    const payload = {
        name: primaryName,
        status: "Attending",
        count: guestCount, // Total number (e.g., 4)
        guests: "None",    // No extra names needed
        note: ""
    };

    // Save to Google Sheets
    saveToDatabase(payload);

    // UI Updates
    document.getElementById('rsvp-step-2').classList.add('hidden');
    document.getElementById('rsvp-success').classList.remove('hidden');
    document.getElementById('location-buttons').classList.remove('hidden');
    
    document.getElementById('success-content').innerHTML = `
        <h3 class="wonderful-text">We Can't Wait!</h3>
        <p class="guest-name">${primaryName.toUpperCase()}</p>
        <p class="success-msg">Your RSVP for ${guestCount} ${guestCount > 1 ? 'people' : 'person'} has been recorded.</p>
    `;

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function submitNo() {
    const primaryName = document.getElementById('primary-guest-name').value.trim();
    
    // Validate that a name was entered before allowing them to say No
    if (!primaryName) {
        const inputField = document.getElementById('primary-guest-name');
        inputField.style.borderColor = 'red';
        setTimeout(() => inputField.style.borderColor = 'var(--border-color)', 1500);
        return; 
    }

    const successSection = document.getElementById('rsvp-success');
    document.getElementById('rsvp-step-1').classList.add('hidden');
    successSection.classList.remove('hidden');
    
    // Update the success section with a note for the couple
    successSection.innerHTML = `
        <h3 class="wonderful-text" style="color: #a94442;">We'll miss you!</h3>
        <p class="guest-name">${primaryName.toUpperCase()}</p>
        <p class="success-msg">Thank you for letting us know. If you'd like, leave a message for the couple below:</p>
        
        <textarea id="decline-note" class="guest-note-textarea" placeholder="Your message..."></textarea>
        
        <button class="btn-submit" style="background-color: #a94442; margin-top: 15px;" onclick="sendDeclineNote()">SEND MESSAGE</button>
        
        <div id="note-confirmation" class="hidden" style="margin-top: 15px; font-size: 0.8rem; color: var(--text-light);">
            ✨ Message sent. We appreciate your wishes!
        </div>
    `;
}

// Function to handle the final note submission
function sendDeclineNote() {
    const note = document.getElementById('decline-note').value;
    // In a real app, you would send 'note' to your database here.
    
    document.getElementById('decline-note').style.display = 'none';
    document.querySelector('#rsvp-success .btn-submit').style.display = 'none';
    document.getElementById('note-confirmation').classList.remove('hidden');
}   

// Function to handle map links
function openMap(venue) {
    const locations = {
        church: "https://maps.app.goo.gl/nWNUCvspJAPxtyyq7", // The Mar Thoma Church, Sharjah
        reception: "https://maps.app.goo.gl/s6Mrjm1oijzknUEp7" // Majestic Hall by Ramada, Ajman
    };
    window.open(locations[venue], '_blank');
}

// Updated No Flow with Note Box
function submitNo() {
    const primaryName = document.getElementById('primary-guest-name').value.trim();
    
    if (!primaryName) {
        showNameError();
        return; 
    }

    document.getElementById('rsvp-step-1').classList.add('hidden');
    const successSection = document.getElementById('rsvp-success');
    const content = document.getElementById('success-content');
    
    successSection.classList.remove('hidden');
    
    content.innerHTML = `
        <h3 class="wonderful-text" style="color: #a94442;">We'll miss you!</h3>
        <p class="guest-name">${primaryName.toUpperCase()}</p>
        <p class="success-msg">Thank you for letting us know. If you'd like, leave a message for the couple below:</p>
        <textarea id="decline-note" class="guest-note-textarea" placeholder="Wishes for the couple..."></textarea>
        <button class="btn-submit" style="background-color: #a94442; margin-top: 15px;" onclick="sendNote()">SEND MESSAGE</button>
    `;
}

// Updated Yes Flow with Maps
function submitRSVP() {
    const primaryName = document.getElementById('primary-guest-name').value.trim();
    document.getElementById('rsvp-step-2').classList.add('hidden');
    
    const successSection = document.getElementById('rsvp-success');
    const content = document.getElementById('success-content');
    
    successSection.classList.remove('hidden');
    document.getElementById('location-buttons').classList.remove('hidden');

    content.innerHTML = `
        <h3 class="wonderful-text">We Can't Wait!</h3>
        <p class="guest-name">${primaryName.toUpperCase()}</p>
        <p class="success-msg">Your RSVP has been received. See you in Sharjah!</p>
    `;

    triggerConfettiCelebration();
}

function sendNote() {
    const content = document.getElementById('success-content');
    content.innerHTML = `
        <h3 class="wonderful-text" style="color: #a94442;">Thank You</h3>
        <p class="success-msg">Your message has been sent to the couple. We appreciate your kind words!</p>
    `;
}

function showNameError() {
    const input = document.getElementById('primary-guest-name');
    input.style.borderColor = 'red';
    input.placeholder = "Please enter your name";
    setTimeout(() => input.style.borderColor = 'var(--border-color)', 1500);
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWKvtJDTNTMSjRSojptG6m6ZtvdacI-Ard5VvGh8BtKj7PRbA4EuRRyUmHVxLaefhsTA/exec";

async function saveToDatabase(payload) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Essential for Google Apps Script
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Error saving RSVP:", error);
    }
}

function submitRSVP() {
    const primaryName = document.getElementById('primary-guest-name').value.trim();
    
    // Collect additional guest names if any
    const extraInputs = document.querySelectorAll('#guest-names-container input');
    let extraNames = [];
    extraInputs.forEach(input => { if(input.value) extraNames.push(input.value); });

    const payload = {
        name: primaryName,
        status: "Attending",
        count: guestCount,
        guests: extraNames.join(", "),
        note: ""
    };

    saveToDatabase(payload);

    // Existing UI transition logic
    document.getElementById('rsvp-step-2').classList.add('hidden');
    document.getElementById('rsvp-success').classList.remove('hidden');
    document.getElementById('location-buttons').classList.remove('hidden');
    document.getElementById('success-content').innerHTML = `
        <h3 class="wonderful-text">We Can't Wait!</h3>
        <p class="guest-name">${primaryName.toUpperCase()}</p>
        <p class="success-msg">Your RSVP has been recorded. See you there!</p>
    `;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function sendNote() {
    const primaryName = document.getElementById('primary-guest-name').value.trim();
    const noteText = document.getElementById('decline-note').value;

    const payload = {
        name: primaryName,
        status: "Declined",
        count: 0,
        guests: "",
        note: noteText
    };

    saveToDatabase(payload);

    document.getElementById('success-content').innerHTML = `
        <h3 class="wonderful-text" style="color: #a94442;">Thank You</h3>
        <p class="success-msg">Your message has been sent to the couple. We appreciate your kind words!</p>
    `;
}