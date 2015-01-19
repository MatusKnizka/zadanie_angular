
	var AjaxHelper = {};
	AjaxHelper.load = function(url, params, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = ensureReadiness; 
		function ensureReadiness() {
			if(xhr.readyState < 4) {
				return;
			}  
			if(xhr.status !== 200) {
				return;
			}  
			if(xhr.readyState === 4) {
				callback(xhr);
			}           
		}     
		xhr.open('GET', url, true);
		xhr.send('');
	}
