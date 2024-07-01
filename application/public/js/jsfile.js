function validateRegistration() 
{
    const usernameDelimeters = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    const passwordDelimeters = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~[\]]).{8,}$/;
    
    let userName = document.forms["registration"]["username"].value;
    let userPass = document.forms["registration"]["password"].value;
    let userConfirm = document.forms["registration"]["confirm_password"].value;

    if (!usernameDelimeters.test(userName)) 
    {
        alert("Please enter a valid email username");
        alert("Username must begin with a character from a-z/A-Z and have 3 or more alphanumeric characters");
        return false;
    }

    if (!passwordDelimeters.test(userPass)) 
    {
        alert("Please enter a valid password");
        alert("Username must have 8 or more characters AND contain at least 1 upper case letter AND 1 number AND one of the following special characters");
        alert("/ * - + ! @ # $ ^ & ~ [ ]");
        return false;
    }

    if (userConfirm != userPass) 
    {
        alert("Passwords must match");
        return false;
    }

    return true;
}