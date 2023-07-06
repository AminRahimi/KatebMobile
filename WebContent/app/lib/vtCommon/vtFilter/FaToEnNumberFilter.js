var restProj =  restProj || {};
restProj.faToEnNumberArray = function() {
	return function(input) {
		if (input == undefined)
			return;
		var enNumber = [];
		var ret = "";
		var inputClone = "";
		for (var int = 0; int < input.length; int++) {
			ret = "";
			symbolMap = {
				'Û±' : '1',
				'Û²' : '2',
				'Û³' : '3',
				'Û´' : '4',
				'Ûµ' : '5',
				'Û¶' : '6',
				'Û·' : '7',
				'Û¸' : '8',
				'Û¹' : '9',
				'Û°' : '0',
			};
			inputClone = input[int].toString();
			for (var i = 0; i < inputClone.length; i++)
				if (symbolMap[inputClone[i]])
					ret += symbolMap[inputClone[i]];
				else
					ret += inputClone[i];
			enNumber.push(ret);
		}
		return enNumber;
	};
};