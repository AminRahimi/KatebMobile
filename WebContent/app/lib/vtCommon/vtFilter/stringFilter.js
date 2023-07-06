var restProj =  restProj || {};
restProj.splitString = function() {
		return function(input,leng) {
			if((typeof input === undefined)  || (input == null) ){
				return;
			}else{
			  
			  input = input.toString();
			  if(leng>0)
				  return input.substr(0,leng)+((input.length > leng)? "..." : "");
			  else 
				  return ((input.length > Math.abs(leng))? "..." : "")+input.substr(leng);
			}
		};
	};
