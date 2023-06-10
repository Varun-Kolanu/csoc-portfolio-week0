let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = "#1c1e1e";
c.fillRect(0, 0, canvas.width, canvas.height);

let radii = [3, 2, 1];
let mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})


window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})

let dotcolor = 'white';
let noOfDots = Math.floor(window.innerWidth / 10);
let farDist = 120;
let speedFactor = 0.6;

let repelRadius = window.innerWidth / 8;

function Circle(x, y, r, dx, dy, quad) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.circularPath = false;
    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        c.strokeStyle = dotcolor;
        c.fillStyle = dotcolor;
        c.stroke();
        c.fill();
    };

    this.update = () => {

        if (this.x > innerWidth + 2 * r) {
            this.x = innerWidth - r;
            this.dx *= -1;
        }
        else if (this.x < -r) {
            this.x = r;
            this.dx *= -1;
        }
        if (this.y > innerHeight + 2 * r) {
            this.y = innerHeight - r;
            this.dy *= -1;
        }
        else if (this.y < -r) {
            this.y = r;
            this.dy *= -1;
        }

        if (quad == 0) {
            this.x += speedFactor * this.dx;
            this.y += speedFactor * this.dy;
        }
        else if (quad == 1) {
            this.x -= speedFactor * this.dx;
            this.y += speedFactor * this.dy;
        }
        else if (quad == 2) {
            this.x += speedFactor * this.dx;
            this.y -= speedFactor * this.dy;
        }
        else {
            this.x -= speedFactor * this.dx;
            this.y -= speedFactor * this.dy;
        }
        this.draw();
    };
}

let dotArray = [];
for (let i = 0; i < noOfDots; i++) {
    let r = radii[i % 3];
    let x = (Math.random() * (innerWidth - 2 * r) + r);
    let y = (Math.random() * (innerHeight - 2 * r) + r);
    let dx = Math.random() * 2;
    let dy = Math.random() * 2;
    dotArray.push(new Circle(x, y, r, dx, dy, i % 4));
}

function init() {
    for (let i = 0; i < noOfDots; i++) {
        let r = radii[i % 3];
        let x = (Math.random() * (innerWidth - 2 * r) + r);
        let y = (Math.random() * (innerHeight - 2 * r) + r);
        let dx = Math.random() * 2;
        let dy = Math.random() * 2;
        dotArray.push(new Circle(x, y, r, dx, dy, i % 4));
    }
}

function repel(arr, mousex, mousey) {
    for (let i = 0; i < arr.length; i++) {
        let dist = Math.sqrt((arr[i].x - mousex) * (arr[i].x - mousex) + (arr[i].y - mousey) * (arr[i].y - mousey));
        if (dist < repelRadius) {
            arr[i].y = mousey + (repelRadius * (arr[i].y - mousey)) / dist;
            arr[i].x = mousex + (repelRadius * (arr[i].x - mousex)) / dist;
        }
    };
}
window.addEventListener("click", (event) => {
    let r = radii[Math.floor(Math.random() * 3)]
    let dx = Math.random() * 2;
    let dy = Math.random() * 2;
    dotArray.push(new Circle(event.x, event.y, r, dx, dy, 1 + Math.floor(Math.random() * 4)));
    dotArray.push(new Circle(event.x, event.y, r, dx, dy, 1 + Math.floor(Math.random() * 4)));
    dotArray.push(new Circle(event.x, event.y, r, dx, dy, 1 + Math.floor(Math.random() * 4)));
    noOfDots += 3;
})

function join(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            let dist = Math.sqrt((arr[i].x - arr[j].x) * (arr[i].x - arr[j].x) + (arr[i].y - arr[j].y) * (arr[i].y - arr[j].y))
            if (dist <= farDist) {
                let num = Math.floor(90 - dist / 2);
                let rep = num.toString();
                c.strokeStyle = `rgb(${rep},${rep},${rep})`;
                c.beginPath();
                c.moveTo(arr[i].x, arr[i].y);
                c.lineTo(arr[j].x, arr[j].y);
                c.stroke();
            }
        }
    }
}
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.fillStyle = "#1c1e1e";
    c.fillRect(0, 0, canvas.width, canvas.height);
    join(dotArray)
    for (let i = 0; i < dotArray.length; i++) {
        dotArray[i].update();
    }
    repel(dotArray, mouse.x, mouse.y);

}

animate();