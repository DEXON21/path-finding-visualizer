const gridElement = document.getElementById('grid');
const rows = 20;
const cols = 20;
let grid = [];
let startNode = null;
let endNode = null;
let algorithm = 'dijkstra';

// Initialize the grid
function createGrid() {
    gridElement.innerHTML = '';
    grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => cellClicked(r, c));
            gridElement.appendChild(cell);
            row.push({ r, c, cell, isWall: false, distance: Infinity, visited: false, previous: null });
        }
        grid.push(row);
    }
    // Set default start and end nodes
    startNode = grid[0][0];
    endNode = grid[rows - 1][cols - 1];
    startNode.cell.classList.add('start');
    endNode.cell.classList.add('end');
}

function cellClicked(r, c) {
    const node = grid[r][c];
    if (node === startNode || node === endNode) return;
    node.isWall = !node.isWall;
    node.cell.classList.toggle('wall');
}

function setAlgorithm(alg) {
    algorithm = alg;
    alert(`Algorithm set to ${alg.toUpperCase()}`);
}

function resetGrid() {
    createGrid();
}

function startSearch() {
    switch (algorithm) {
        case 'dijkstra':
            dijkstra();
            break;
        case 'bfs':
            bfs();
            break;
        case 'dfs':
            dfs();
            break;
    }
}

// Dijkstra's Algorithm
async function dijkstra() {
    const unvisited = [];
    startNode.distance = 0;
    grid.flat().forEach(node => unvisited.push(node));

    while (unvisited.length > 0) {
        unvisited.sort((a, b) => a.distance - b.distance);
        const current = unvisited.shift();
        if (current.isWall) continue;
        if (current.distance === Infinity) break;
        current.visited = true;
        current.cell.classList.add('visited');
        if (current === endNode) {
            await drawPath(current);
            return;
        }
        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
            const alt = current.distance + 1;
            if (alt < neighbor.distance) {
                neighbor.distance = alt;
                neighbor.previous = current;
            }
        }
        await sleep(10);
    }
}

// Breadth-First Search
async function bfs() {
    const queue = [startNode];
    startNode.visited = true;

    while (queue.length > 0) {
        const current = queue.shift();
        if (current.isWall) continue;
        current.cell.classList.add('visited');
        if (current === endNode) {
            await drawPath(current);
            return;
        }
        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
            if (!neighbor.visited && !neighbor.isWall) {
                neighbor.visited = true;
                neighbor.previous = current;
                queue.push(neighbor);
            }
        }
        await sleep(10);
    }
}

// Depth-First Search
async function dfs() {
    const stack = [startNode];
    startNode.visited = true;

    while (stack.length > 0) {
        const current = stack.pop();
        if (current.isWall) continue;
        current.cell.classList.add('visited');
        if (current === endNode) {
            await drawPath(current);
            return;
        }
        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
            if (!neighbor.visited && !neighbor.isWall) {
                neighbor.visited = true;
                neighbor.previous = current;
                stack.push(neighbor);
            }
        }
        await sleep(10);
    }
}

// Helper functions
function getNeighbors(node) {
    const neighbors = [];
    const { r, c } = node;
    if (r > 0) neighbors.push(grid[r - 1][c]);
    if (r < rows - 1) neighbors.push(grid[r + 1][c]);
    if (c > 0) neighbors.push(grid[r][c - 1]);
    if (c < cols - 1) neighbors.push(grid[r][c + 1]);
    return neighbors;
}

async function drawPath(node) {
    while (node.previous) {
        node.cell.classList.add('path');
        node = node.previous;
        await sleep(30);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

createGrid();
