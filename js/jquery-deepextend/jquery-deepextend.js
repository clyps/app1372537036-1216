
jQuery.deepextend = function( target, options) {
    for( var k in options) {
        try {
            var item = options[k]
            if (typeof item == 'object' || typeof item == 'array') {
                target[k] = jQuery.deepextend(target[k],item)
            } else {
                target[k] = item
            }
        } catch(e){
            target[k] = options[k]
        }
    }

    return target; 
};
