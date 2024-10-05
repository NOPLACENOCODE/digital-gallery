document.getElementById('logo').addEventListener('click', () => {
    // Fade out the current screen and load the next
    document.getElementById('start-screen').style.opacity = '0';
    setTimeout(() => {
        // Load the corridor scene (we'll set this up next)
        window.location.href = 'corridor.html';
    }, 1000);
});
