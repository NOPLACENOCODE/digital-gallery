document.addEventListener('keydown', (e) => {
    // Example of walking forward
    if (e.key === 'ArrowUp' || e.key === 'w') {
        let corridor = document.getElementById('corridor');
        corridor.scrollTop += 10; // Scroll effect to simulate movement
    }
});
