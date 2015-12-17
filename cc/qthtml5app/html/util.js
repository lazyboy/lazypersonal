.pragma library

function func() {
    
}

var mytest = function() {
  document.getElementById('dummy').innerText = 'changed';
};

onload = function() { mytest(); };

//alert('loaded');

