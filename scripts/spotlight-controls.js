AFRAME.registerComponent('spotlight-controls', {
    init: function() {
        this.startPoint = null;
        this.endPoint = null;
        this.lines = [];
        this.drawingTimer;
        this.drawingTimeOut = 3000;
        this.zFightingOffset = 0.01;

        this.bindMethods();
        this.addEventListeners();
    },

    bindMethods: function() {
        this.onClick = this.onClick.bind(this);
        this.onDrawingTimeOut = this.onDrawingTimeOut.bind(this);
    },

    addEventListeners: function() {
        this.el.addEventListener('click', this.onClick);
    },

    onClick: function(event) {
        var point = event.detail.intersection.point;
        this.addPointer(point);
        
        if (this.startPoint) {
            this.endPoint = point;
            this.drawLine();
            this.storeLine();
            this.drawingTimer = setTimeout(
                this.onDrawingTimeOut,
                this.drawingTimeOut
            );
        } else {
            this.startPoint = point;
            clearTimeout(this.drawingTimer);
        }
    },

    addPointer: function(point) {
        var coneColor = 'orange';
        var coneHeight = 0.5;
        var coneRadiusTop = 0.01;
        var coneRadiusBottom = 0.25;
        var coneRotation = '-90 0 0';
        var conePosition = '' + point.x + ' ' + -point.z + ' ' + (coneHeight / 2);

        var torusColor = '';
        var torusRadius = 0.2;
        var torusRadiusTubular = 0.01;
        var torusPosition = '' + point.x + ' ' + -point.z + ' ' + point.y;

        var cone = document.createElement('a-cone');
        cone.setAttribute('color', coneColor);
        cone.setAttribute('height', coneHeight);
        cone.setAttribute('radius-top', coneRadiusTop);
        cone.setAttribute('radius-bottom', coneRadiusBottom);
        cone.setAttribute('rotation', coneRotation);
        cone.setAttribute('position', conePosition);

        var torus = document.createElement('a-torus');
        torus.setAttribute('radius', torusRadius);
        torus.setAttribute('radius-tubular', torusRadiusTubular);
        torus.setAttribute('position', torusPosition);

        this.el.appendChild(cone);
        this.el.appendChild(torus);
    },

    drawLine: function() {
        var lineStart = '' + 
            this.startPoint.x + ' ' + 
            -this.startPoint.z + ' ' + 
            (this.startPoint.y + this.zFightingOffset);
        var lineEnd = '' + 
            this.endPoint.x + ' ' + 
            -this.endPoint.z + ' ' + 
            (this.startPoint.y + this.zFightingOffset);
        var lineColor = 'white';
        var lineWidth = '5';

        var line = document.createElement('a-entity');
        line.setAttribute(
            'meshline', 
            'color: ' + lineColor + '; ' + 
            'lineWidth: ' + lineWidth + '; ' + 
            'path: ' + lineStart + ', ' + lineEnd 
        );
        this.el.appendChild(line);
    },

    storeLine: function() {
        this.lines.push({
            startPoint: this.startPoint,
            endPoint: this.endPoint
        });
        this.startPoint = null;
        this.endPoint = null;
    },

    onDrawingTimeOut: function() {
        this.resetFloor();
        this.positionSpotlights(this.getSpotlightPositions());
        this.resetLineData();
    },

    resetFloor: function() {
        // Clear pointer and spotlight objects
        while(this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
    },

    getSpotlightPositions: function() {
        // Compute midpoints
        var width = 25;
        var midPoints = this.lines.map(function(line) {
            return ((-line.startPoint.z) + (-line.endPoint.z)) / 2;
        });
        midPoints.push(-width);
        midPoints.push(width);
        midPoints.sort(function(a, b) {
            return a - b;
        });

        // Compute radius and center horizontal coordinates
        var positions = [];
        for (var i = 0; i < midPoints.length - 1; i++) {
            var radius = (midPoints[i + 1] - midPoints[i]) / 2;
            positions.push({
                radius,
                center: midPoints[i] + radius
            });
        }
        return positions;
    },

    positionSpotlights: function(positions) {
        var plane = this.el;
        var zFightingOffset = this.zFightingOffset;
        positions.forEach(function(position) {
            // Do not use the full diameter in order to leave
            // some space between spotlights
            var slWidth = position.radius * 1.6;
            var slHeight = slWidth;
            var slPosition = '0 ' + position.center + ' ' + zFightingOffset;
            var slOpacity = 0.2;
            var slImage = 'assets/roundlight.png';

            var spotlight = document.createElement('a-plane');
            spotlight.setAttribute('position', slPosition);
            spotlight.setAttribute('width', slWidth);
            spotlight.setAttribute('height', slHeight);
            spotlight.setAttribute('opacity', slOpacity);
            spotlight.setAttribute('src', slImage);

            plane.appendChild(spotlight);
        }); 
    },

    resetLineData: function() {
        this.startPoint = null;
        this.endPoint = null;
        this.lines = [];
    },

    reset: function() {
        this.resetFloor();
        this.resetLineData();
    },

    setOpacity: function(opacity) {
        this.el.childNodes.forEach(function(node) {
            node.setAttribute('opacity', 0.2 * opacity);
        });
    }
});