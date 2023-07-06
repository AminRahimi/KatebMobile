var restProj =  restProj || {};
restProj.faToEnAndYeKe = function() {
    return function(input) {
        if (input == undefined)
            return;
        var ret = "", symbolMap = {
             '۱' : '1',
             '۲' : '2',
             '۳' : '3',
             '۴' : '4',
             '۵' : '5',
             '۶' : '6',
             '۷' : '7',
             '۸' : '8',
             '۹' : '9',
             '۰' : '0',
             'ي' : 'ی',
             'ك' : 'ک'
        };
        input = input.toString();
        for (var i = 0; i < input.length; i++)
            if (symbolMap[input[i]])
                ret += symbolMap[input[i]];
            else
                ret += input[i];

        return ret;
    };
};