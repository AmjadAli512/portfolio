particlesJS("particles-js", {
    particles: {
        number: {
            // Use fewer particles on smaller screens for better performance
            value: window.innerWidth < 768 ? 40 : 80,
            density: { enable: true, value_area: 800 }
        },
        color: { value: "#00bcd4" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00bcd4",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            // Use slower speed on smaller screens
            speed: window.innerWidth < 768 ? 1.5 : 3,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out"
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// This is a custom addition to make the particles truly responsive on resize
// without needing a full page reload.
let resizeTimeout;
window.addEventListener('resize', () => {
    // Clear the timeout to avoid multiple executions
    clearTimeout(resizeTimeout);
    // Set a timeout to run the function once after resizing stops
    resizeTimeout = setTimeout(() => {
        // Access the currently running particles instance
        const pJS = window.pJSDom[0].pJS;
        // Update the particle number and speed based on the new window width
        pJS.particles.number.value = window.innerWidth < 768 ? 40 : 80;
        pJS.particles.move.speed = window.innerWidth < 768 ? 1.5 : 3;
        // Refresh the canvas with the new settings
        pJS.fn.particlesRefresh();
    }, 250); // 250ms delay
});