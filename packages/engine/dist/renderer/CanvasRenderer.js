/**
 * Fallback Canvas 2D renderer when WebGL is unavailable
 * Simple orthographic renderer for debugging/fallback
 */
export class CanvasRenderer {
    constructor(config) {
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.width = config.width || window.innerWidth;
        this.height = config.height || window.innerHeight;
        // Create or use provided canvas
        if (config.canvas) {
            this.canvas = config.canvas;
        }
        else {
            this.canvas = document.createElement('canvas');
            this.canvas.style.display = 'block';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.margin = '0';
            this.canvas.style.padding = '0';
            document.body.appendChild(this.canvas);
        }
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context');
        }
        this.ctx = context;
        this.setupWindowResize();
    }
    setupWindowResize() {
        window.addEventListener('resize', () => this.onWindowResize());
    }
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    render(_delta) {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Draw grid for terrain visualization
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        // Draw center crosshair
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 2;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const crossSize = 20;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - crossSize, centerY);
        this.ctx.lineTo(centerX + crossSize, centerY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - crossSize);
        this.ctx.lineTo(centerX, centerY + crossSize);
        this.ctx.stroke();
        // Draw info text
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillText('Canvas 2D Renderer (WebGL unavailable)', 20, 40);
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillText('Hardware acceleration is disabled', 20, 60);
        this.ctx.fillText('Enable in browser settings for better performance', 20, 75);
    }
    dispose() {
        // Nothing to dispose for 2D canvas
    }
}
//# sourceMappingURL=CanvasRenderer.js.map