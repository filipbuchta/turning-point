(() => {
    const PRIMARY_COLOR = "#71c1fd";
    const threshold = 10;

    let canvas = document.getElementById("gameCanvas");
    let context = canvas.getContext("2d");

    let currentLevelIndex = 0;
    let currentLevel = null;

    let selectedPoint = null;

    startLevel = (levelIndex) => {
        currentLevelIndex = levelIndex;
        currentLevel = JSON.parse(JSON.stringify(levels[levelIndex]));
        turningNumber = calculateTurningNumber(currentLevel.curve);
        gameState = "game";
    };

    canvas.onmousemove = (e) => {

        if (e.buttons === 0) {

            document.body.style.cursor = "default";
            let curve = currentLevel.curve;
            for (let i = 0; i < curve.length; i++) {
                let point = curve[i];
                if (e.offsetX > point.x - threshold &&
                    e.offsetY > point.y - threshold &&
                    e.offsetX < point.x + threshold &&
                    e.offsetY < point.y + threshold) {
                    document.body.style.cursor = "-webkit-grab";
                    break;
                }
            }
        }
        else if (e.buttons === 1) {
            if (selectedPoint != null) {
                selectedPoint.x = e.offsetX;
                selectedPoint.y = e.offsetY;

                // document.body.style.cursor = "-webkit-grabbing";
            }
        }


    };

    canvas.onmousedown = (e) => {
        console.log(e.offsetX, e.offsetY);

        selectedPoint = null;

        let curve = currentLevel.curve;
        for (let i = 0; i < curve.length; i++) {
            let point = curve[i];
            if (e.offsetX > point.x - threshold &&
                e.offsetY > point.y - threshold &&
                e.offsetX < point.x + threshold &&
                e.offsetY < point.y + threshold) {
                console.log(i);
                selectedPoint = point;
                break;
            }
        }
    };

    function win() {
        let audio = new Audio('win.ogg');
        audio.play();
        gameState = "win";
        setTimeout(() => startLevel(currentLevelIndex + 1), 3000);
    }

    function lose() {
        let audio = new Audio('lose.ogg');
        audio.play();
        gameState = "lost";
        setTimeout(() => startLevel(currentLevelIndex ), 1000);
    }


    function checkWin(curve) {

        let count = calculateTurningNumber(curve);

        if (count !== turningNumber) {
            lose();
        }

        let r = false;
        for (let i = 0; i < curve.length; i++) {
            let p1 = curve[i];
            let p2 = (i + 1 == curve.length) ? curve[0] : curve[i + 1];


            for (let j = 0; j < curve.length; j++) {

                if (i == j || i + 1 == j || j + 1 == i || (j + 1 == curve.length && i == 0) || (i + 1 == curve.length && j == 0)) {
                    //  console.log("skip");
                    continue;
                }
                //console.log(i, i+1, j, j+1);

                let p3 = curve[j];
                let p4 = (j + 1 == curve.length) ? curve[0] : curve[j + 1];

                let result = intersectionBetweenSegments(p1, p2, p3, p4);
                if (result != null) {
                    r = true;
                    //  console.log("int");
                    break;
                }
            }
            if (r == true) {
                break;
            }
        }

        if (r === false) {
            win();
        }
    }

    function drawOutlined(context, txt, x,y ){

        context.font = "40px Helvetica";

        context.strokeStyle = 'black';

        context.miterLimit = 2;
        context.lineJoin = 'circle';

        context.lineWidth = 3;
        context.strokeText(txt, x, y);
        context.lineWidth = 1;
        context.fillText(txt, x, y);
    }
    function drawCurve(context, curve) {
        context.strokeStyle = PRIMARY_COLOR;

        for (let y = 0; y < 10; y++) {
            let points = [];
            for (let i = 0; i < curve.length; i++) {
                let point = curve[i];
                points.push(point.x, point.y + y);
            }

            context.beginPath();
            context.moveTo(points[0], points[1]);  // optionally move to first point

            context.curve(points, 0.5, 25, true);                 // add cardinal spline to path
            context.stroke();                      // stroke path

        }

        {
            let points = [];
            for (let i = 0; i < curve.length; i++) {
                let point = curve[i];
                points.push(point.x, point.y);
            }
            context.beginPath();
            context.moveTo(points[0], points[1]);  // optionally move to first point


            context.strokeStyle = "black";

            context.curve(points, 0.5, 25, true);                 // add cardinal spline to path
            context.stroke();
        }
    }

    let tick = () => {
        requestAnimationFrame(tick);

        if (gameState == "lost") {
            let txt = "You have lost";
            drawOutlined(context, "You have lost",canvas.width / 2-70 ,canvas.height / 2);

            return;
        } else if (gameState == "win") {
            let txt = "You have won";
            drawOutlined(context, "You have won",canvas.width / 2-70 ,canvas.height / 2);
            return;
        }


        canvas.width = canvas.width;

        let curve = currentLevel.curve;


        checkWin(curve);


        drawCurve(context, curve);

        for (let i = 0; i < curve.length; i++) {
            let point = curve[i];

            context.beginPath();
            context.fillStyle = "black";
            context.arc(point.x, point.y, 8, 0, Math.PI * 2, true);
            context.fill();
            context.fillStyle = "#ffc379";
            context.arc(point.x, point.y, 5, 0, Math.PI * 2, true);
            context.fill();
        //    context.strokeStyle = "black";
            //context.strokeText(i, point.x, point.y);

        }
    };


    startLevel(currentLevelIndex);
    tick();
})();