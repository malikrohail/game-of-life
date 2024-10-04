const canvas = document.querySelector("canvas");
const clearBtn = document.getElementById("clearBtn");
const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const context = canvas.getContext("2d");
const block = 20;
canvas.width = 800;
canvas.height = 800;
const ROW = canvas.width / block;
const COL = canvas.height / block;
let grid = buildGrid();
let stopped = true;

function buildGrid() {
    const grid = [];
    for (let y = 0; y < ROW; y++) {
        const col = [];
        for (let x = 0; x < COL; x++) {
            col.push(0);
        }
        grid.push(col);
    }
    return grid;
}

function plotGrid(grid) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            context.beginPath();
            context.rect(i * block, j * block, block, block);
            context.fillStyle = grid[i][j] ? "black" : "white";
            context.fill();
            context.stroke();
        }
    }
}

function nextGen(grid) {
    const nextGen = grid.map(arr => [...arr]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let numNeighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    const x = col + i;
                    const y = row + j;
                    if (x >= 0 && y >= 0 && x < COL && y < ROW) {
                        numNeighbours += grid[x][y];
                    }
                }
            }
            if (cell === 1 && (numNeighbours < 2 || numNeighbours > 3)) {
                nextGen[col][row] = 0;
            } else if (cell === 0 && numNeighbours === 3) {
                nextGen[col][row] = 1;
            }
        }
    }
    return nextGen;
}

function update() {
    if (!isCanvasBlank(grid) && !stopped) {
        grid = nextGen(grid);
        plotGrid(grid);
        requestAnimationFrame(update);
    }
}

function isCanvasBlank(grid) {
    return grid.flat().reduce((a, b) => a + b) === 0;
}

function clearGrid() {
    grid = buildGrid();
    plotGrid(grid);
}

// Event Listeners
canvas.addEventListener("click", evt => {
    const tileX = ~~(evt.offsetX / block);
    const tileY = ~~(evt.offsetY / block);
    grid[tileX][tileY] = grid[tileX][tileY] ? 0 : 1;
    plotGrid(grid);
});

clearBtn.onclick = () => clearGrid();
startBtn.onclick = () => {
    stopped = false;
    if (!isCanvasBlank(grid)) requestAnimationFrame(update);
};
endBtn.onclick = () => stopped = true;

plotGrid(grid);
