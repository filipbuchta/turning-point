function calculateTurningNumber(curve) {
    let sum2 = 0;

    for (let i = 0; i < curve.length; i++) {
        let p1;
        if (i === 0) {
            p1 = curve[curve.length - 1];
        } else {
            p1 = curve[i - 1];
        }
        let p2 = curve[i];
        let p3;
        if (i + 1 === curve.length) {
            p3 = curve[0];
        } else {
            p3 = curve[i + 1];
        }

        let angle1 = find_angle(p1, p2, p3);
        let angle2 = find_angle(p3, p2, p1);


        let e1 = {x: p1.x - p2.x, y: p1.y - p2.y};
        let e2 = {x: p3.x - p2.x, y: p3.y - p2.y};

        e1 = {x: -e1.y, y: e1.x};

        let s = (e1.x * e2.x + e1.y * e2.y) < 0;

        if (s) {
            sum2 += (angle1);
        } else {
            sum2 += (angle1);
        }
    }
    let count = Math.round(sum2 / Math.PI);
    return count;
}


function intersectionBetweenSegments(p0, p1, p2, p3) {
    var denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y)
    var ua = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x)
    var ub = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x)
    if (denominator < 0) {
        ua = -ua;
        ub = -ub;
        denominator = -denominator
    }

    if (ua >= 0.0 && ua <= denominator && ub >= 0.0 && ub <= denominator && denominator != 0) {
        return {x: p0.x + ua / denominator * (p1.x - p0.x), y: p0.y + ua / denominator * (p1.y - p0.y)}
    }
    return null;
}

function find_angle(a, b, c) {
    var ab = {x: b.x - a.x, y: b.y - a.y};
    var cb = {x: b.x - c.x, y: b.y - c.y};

    var dot = (ab.x * cb.x + ab.y * cb.y); // dot product
    var cross = (ab.x * cb.y - ab.y * cb.x); // cross product

    var alpha = -Math.atan2(cross, dot);
    if (alpha < 0) alpha += 2 * Math.PI;
    return alpha;
}