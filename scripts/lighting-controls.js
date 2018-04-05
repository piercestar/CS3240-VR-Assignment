AFRAME.registerComponent('lighting-controls', {
    schema: {
        up: { default: 'up' },
        down: { default: 'down' }
    },

    init: function() {
        // Lighting settings
        this.lighting = 'default';
        this.interval = 0;
        this.offset = 10;
        this.delay = 1500;
        this.intensityDefault = 1;
        this.intensityDim = 0.6;
        this.intensityBright = 1.4;

        // Planar elements
        this.up = document.querySelector('#' + this.data.up);
        this.down = document.querySelector('#' + this.data.down);
        this.currentPosition = camera.getAttribute('rotation');
        this.light = this.el;
        this.spotlights = this.down.components['spotlight-controls'];
        
        this.bindMethods();
        this.addEventListeners();
    },

    bindMethods: function() {
        this.onMouseLeaveUp = this.onMouseLeaveUp.bind(this);
        this.onMouseEnterUp = this.onMouseEnterUp.bind(this);

        this.onMouseLeaveDown = this.onMouseLeaveDown.bind(this);
        this.onMouseEnterDown = this.onMouseEnterDown.bind(this);

        this.setIntervalToDim = this.setIntervalToDim.bind(this);
        this.setIntervalToBrighten = this.setIntervalToBrighten.bind(this);
    },

    addEventListeners: function() {
        this.up.addEventListener('mouseleave', this.onMouseLeaveUp);
        this.up.addEventListener('mouseenter', this.onMouseEnterUp);
        
        this.down.addEventListener('mouseleave', this.onMouseLeaveDown);
        this.down.addEventListener('mouseenter', this.onMouseEnterDown);
    },

    onMouseLeaveUp: function(event) {
        clearInterval(this.interval);
    },

    onMouseEnterUp: function(event) {
        this.interval = setInterval(this.setIntervalToBrighten, this.delay);
    },

    onMouseLeaveDown: function(event) {
        clearInterval(this.interval);
    },

    onMouseEnterDown: function(event) {
        this.interval = setInterval(this.setIntervalToDim, this.delay);
    },

    setIntervalToBrighten: function() {
        if (this.checkForHold() && this.lighting != 'bright') {
            this.brighten();
        }
    },

    setIntervalToDim: function() {
        // console.log(this.currentPosition);
        if (this.checkForHold() && this.lighting != 'dim') {
            this.dim();
        }
        // console.log(this.currentPosition);
    },

    checkForHold: function() {
        var previousPosition = this.currentPosition;
        // For some reason objects are not being assigned correctly
        // i.e this.currentPosition = camera.getAttribute('rotation');
        // will result in currentPosition not being updated correctly
        // between interval calls.
        this.currentPosition = {
           x: camera.getAttribute('rotation').x,
           y: camera.getAttribute('rotation').y,
           z: camera.getAttribute('rotation').z
        };

        return previousPosition.x >= this.currentPosition.x - this.offset && previousPosition.x <= this.currentPosition.x + this.offset &&
            previousPosition.y >= this.currentPosition.y - this.offset && previousPosition.y <= this.currentPosition.y + this.offset &&
            previousPosition.z >= this.currentPosition.z - this.offset && previousPosition.z <= this.currentPosition.z + this.offset;
    },

    brighten: function() {
        this.lighting = 'bright';
        this.light.setAttribute('intensity', this.intensityBright);
        this.spotlights.setOpacity(1.2);
    },

    dim: function() {
        this.lighting = 'dim';
        this.light.setAttribute('intensity', this.intensityDim);
        this.spotlights.setOpacity(0.5);
    },

    reset: function() {
        this.lighting = 'default';
        this.light.setAttribute('intensity', this.intensityDefault);
    }
});