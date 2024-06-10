// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.const 

const ValidatePassword = (password) =>
{
    if (password.length === 0)
        return false;
    const re = /^(?=.*\d)(?=.*[A-Za-z])[\w]{8,}$/;
    // console.log(password)

    return re.test(password);
}


export default ValidatePassword;
