document.addEventListener('keydown', (e) => {
    let corridor = document.getElementById('corridor');
    let scrollAmount = 30; // Adjust this value to change the speed of scrolling

    // Move forward
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        window.scrollBy(0, scrollAmount);
    }

    // Move backward
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        window.scrollBy(0, -scrollAmount);
    }
});
