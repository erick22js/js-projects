// Include external script
function include(path, onload){path = document.currentScript.src.split('/').slice(0, -1).join('/')+'/'+path;var se = document.createElement("script");se.src = path;document.body.appendChild(se);if(onload){se.onload = function(){onload();}}};

include("./debug.js");
include("./shay/shay.js" , function(){



console.log("Iniciado!");

});
