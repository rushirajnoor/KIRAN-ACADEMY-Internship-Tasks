console.log('Hello World')

function clickMe() {
    // alert('BUTTON CLICKED');

    let h1 = document.getElementById('one');

    if (h1.innerHTML == 'Welcome to My Webpage') {
        h1.innerHTML = "Hello I am Rushi Rajnoor";
        h1.style.backgroundColor = 'blue';
    }

    else {
        h1.innerHTML = "Welcome to My Webpage";
        h1.style.backgroundColor = 'yellow';
    }


}

