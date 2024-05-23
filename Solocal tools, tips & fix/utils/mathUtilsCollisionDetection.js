const utilsCollision = {
    norm: (value, min, max) => (value - min) / (max - min),

    lerp: (norm, min, max) => (max - min) * norm + min,

    map: (value, sourceMin, sourceMax, destMin, destMax) =>
        utils.lerp(utilsCollision.norm(value, sourceMin, sourceMax), destMin, destMax),

    clamp: (value, min, max) => Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max)),

    distance: (p0, p1) => {
        const { x: x0, y: y0 } = p0;
        const { x: x1, y: y1 } = p1;
        const dx = x1 - x0;
        const dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY: (x0, y0, x1, y1) => {
        const dx = x1 - x0;
        const dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    circleCollision: (c0, c1) => utilsCollision.distance(c0, c1) <= c0.radius + c1.radius,

    circlePointCollision: (x, y, circle) => utilsCollision.distanceXY(x, y, circle.x, circle.y) < circle.radius,

    pointInRect: (x, y, { x: rectX, y: rectY, width, height }) =>
        utils.inRange(x, rectX, rectX + width) && utilsCollision.inRange(y, rectY, rectY + height),

    inRange: (value, min, max) => value >= Math.min(min, max) && value <= Math.max(min, max),

    rangeIntersect: (min0, max0, min1, max1) =>
        Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1),

    rectIntersect: (r0, r1) =>
        utilsCollision.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
        utilsCollision.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)
};
