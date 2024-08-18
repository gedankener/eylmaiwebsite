// Set up the canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Grid properties
const gridSize = 20;
const numColumns = Math.ceil(canvas.width / gridSize);
const numRows = Math.ceil(canvas.height / gridSize);

// Create grid points
let points = [];
for (let y = 0; y <= numRows; y++) {
    for (let x = 0; x <= numColumns; x++) {
        points.push({
            x: x * gridSize,
            y: y * gridSize,
            baseX: x * gridSize,
            baseY: y * gridSize,
            vx: 0,
            vy: 0
        });
    }
}

// Mouse interaction
let mouse = { x: 0, y: 0 };
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update points
    points.forEach(point => {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 100 - distance) * 0.1;
        
        point.vx += (dx / distance) * force;
        point.vy += (dy / distance) * force;
        
        point.vx *= 0.9;
        point.vy *= 0.9;
        
        point.x += point.vx;
        point.y += point.vy;
        
        const springForceX = (point.baseX - point.x) * 0.3;
        const springForceY = (point.baseY - point.y) * 0.3;
        
        point.vx += springForceX;
        point.vy += springForceY;
    });
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    
    // Draw horizontal lines
    ctx.beginPath();
    for (let y = 0; y <= numRows; y++) {
        ctx.moveTo(points[y * (numColumns + 1)].x, points[y * (numColumns + 1)].y);
        for (let x = 1; x <= numColumns; x++) {
            const point = points[y * (numColumns + 1) + x];
            ctx.lineTo(point.x, point.y);
        }
    }
    ctx.stroke();
    
    // Draw vertical lines
    ctx.beginPath();
    for (let x = 0; x <= numColumns; x++) {
        ctx.moveTo(points[x].x, points[x].y);
        for (let y = 1; y <= numRows; y++) {
            const point = points[y * (numColumns + 1) + x];
            ctx.lineTo(point.x, point.y);
        }
    }
    ctx.stroke();
    
    requestAnimationFrame(animate);
}

animate();