document.getElementById('logo').addEventListener('click', () => {
    // Fade out the current screen and load the next
    document.getElementById('start-screen').style.opacity = '0';
    setTimeout(() => {
        // Redirect to the 3D environment page
        window.location.href = '3d_environment.html';
    }, 1000); // 1-second fade-out before transitioning
});
