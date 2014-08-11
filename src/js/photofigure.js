/**
 *
 */

(function(root, $, factory) {
	//set up videoplayer appropriately for the enviroment.
	if (typeof define === 'function' && (define.cmd || define.amd)) {
		define(function() {
			return factory();
		});
	} else {
		//as a browser global
		root.photofigure = factory();
	}
})(window, $, function() {

	var Figure = function(){

	};


	return Figure;

});