document.addEventListener("DOMContentLoaded", () => {displayPhotos();});

function displayPhotos() 
{
    const container = document.getElementById("photo-container");

    fetch("https://jsonplaceholder.typicode.com/albums/2/photos")
        .then(response => response.json())
        .then(info => {
            info.forEach(photo => {
                const photoDiv = document.createElement("div");
                photoDiv.classList.add("photo-item");
                photoDiv.innerHTML = `<img src="${photo.url}" alt="${photo.title}" width="180" height="180"><a href="viewpost" class="post"><p>${photo.title}</p></a>`;
                photoDiv.addEventListener("click", () => fadeOut(photoDiv));
                container.appendChild(photoDiv);
            });
            updateCount(info.length);
        })
        .catch(error => {
            console.error('Fetch Error', error);
        });
}

function fadeOut(photo) 
{
    let opacity = 1;
    const effect = setInterval(() => {
        if(opacity <= 0)
        {
            clearInterval(effect);
            photo.remove();
            updateCount(-1);
        }
        else
        {
            opacity -= 0.25
            photo.style.opacity = opacity;
        }
    }, 60)
}

function updateCount(num) 
{
    const count = document.getElementById("photos-contained");
    var temp = parseInt(count.textContent.split(": ")[1]);
    temp += num;
    count.textContent = 'Number of Photos: ' + temp;
}

function validateRegistration() 
{
    const usernameDelimeters = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    const passwordDelimeters = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~[\]]).{8,}$/;
    
    let userName = document.forms["registration"]["username"].value;
    let userPass = document.forms["registration"]["password"].value;
    let userConfirm = document.forms["registration"]["confirm_password"].value;

    if (!usernameDelimeters.test(userName)) 
    {
        alert("Please enter a valid email username\nUsername must begin with a character from a-z/A-Z and have 3 or more alphanumeric characters");
        return false;
    }

    if (!passwordDelimeters.test(userPass)) 
    {
        alert("Please enter a valid password\nUsername must have 8 or more characters AND contain at least 1 upper case letter AND 1 number AND one of the following special characters\n/ * - + ! @ # $ ^ & ~ [ ]");
        return false;
    }

    if (userConfirm != userPass) 
    {
        alert("Passwords must match");
        return false;
    }

    alert("Registration Submitted Succesffuly");

    return true;
}
