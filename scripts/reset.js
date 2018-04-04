function reset() {
    var scene = document.querySelector('a-scene');
    var longPress = false;
    var timeout = 3000;

    /*
     * Triggers the reset() function for components if a reset function
     * has been defined in the component, ignores otherwise
     * 
     * (EG. <a-entity id="myId" my-component></a-entity>)
     * 
     * @param id
     *          The id of the DOM element which uses the component
     *          id = "myId" in the above example
     * 
     * @param name
     *          The name of the component as registered in A-FRAME
     *          name = "my-component" in the above example
     */
    var triggerComponentReset = function(id, name) {
        var element = document.querySelector('#' + id);
        var components = element.components;
        if (components && components[name] && components[name].reset) {
            components[name].reset();
        }
    };

    var onTouchStart = function(event) {
        longPress = true;
        setTimeout(function() {
            if (longPress) {
                // Add component reset here
                triggerComponentReset('light', 'lighting-controls');
                triggerComponentReset('ground', 'spotlight-controls');
            }
        }, timeout);
    };
    
    var onTouchEnd = function(event) {
        longPress = false;
    };

    scene.addEventListener('touchstart', onTouchStart);
    scene.addEventListener('touchend', onTouchEnd);
}