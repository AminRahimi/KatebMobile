var restProj =  restProj || {};
restProj.slice =  function(){
  return function(arr, start, end)
         {
            return (arr)?arr.slice(start, end):null;
		 };
};