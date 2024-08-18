// Set up the canvas
const canvas = document.getElementById('grid-canvas');
if (!canvas) {
    console.error('Canvas element not found');
    throw new Error('Canvas element not found');
}
const ctx = canvas.getContext('2d');

// Hexagon properties
const hexRadius = 40;
const hexHeight = hexRadius * Math.sqrt(3);
const hexWidth = hexRadius * 2;
const spacing = 10;
let points = [];

// Mouse interaction
let mouse = { x: 0, y: 0 };

// Probability of a hexagon being present
const hexagonProbability = 0.3;

// Glow properties
const glowColor = '#002E57'; // Orange color from the logo
const glowSize = 10;
const strokeWidth = .5;

function createGrid() {
    points = [];
    const numColumns = Math.ceil(canvas.width / ((hexWidth + spacing) * 0.75)) + 1;
    const numRows = Math.ceil(canvas.height / (hexHeight + spacing)) + 1;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numColumns; col++) {
            if (Math.random() < hexagonProbability) {
                const x = col * (hexWidth + spacing) * 0.75;
                const y = row * (hexHeight + spacing) + (col % 2 === 0 ? 0 : (hexHeight + spacing) / 2);
                points.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createGrid();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background matching the logo's dark blue
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update points
    points.forEach(point => {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 100 - distance) * 0.1;
        
        if (distance > 0) {
            point.vx += (dx / distance) * force;
            point.vy += (dy / distance) * force;
        }
        
        point.vx *= 0.9;
        point.vy *= 0.9;
        
        point.x += point.vx;
        point.y += point.vy;
        
        const springForceX = (point.baseX - point.x) * 0.1;
        const springForceY = (point.baseY - point.y) * 0.1;
        
        point.vx += springForceX;
        point.vy += springForceY;
    });
    
    // Draw glowing hexagonal grid
    points.forEach(point => {
        drawGlowingHexagonStroke(point.x, point.y);
    });

    requestAnimationFrame(animate);
}

function drawGlowingHexagonStroke(x, y) {
    ctx.save();
    
    // Set up the glow effect
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = strokeWidth;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowSize;
    
    // Draw hexagon path
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = 2 * Math.PI / 6 * i;
        const hx = x + hexRadius * Math.cos(angle);
        const hy = y + hexRadius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(hx, hy);
        } else {
            ctx.lineTo(hx, hy);
        }
    }
    ctx.closePath();
    
    // Stroke the hexagon
    ctx.stroke();
    
    // Draw a sharper, non-glowing stroke on top
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFFFFF'; // White for better contrast
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Initialization
resizeCanvas();
animate();