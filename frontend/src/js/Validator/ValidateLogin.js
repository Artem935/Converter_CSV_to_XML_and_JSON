


const ValidateLogin = (login) =>
{
    if (login.length < 4)
        return false;
    const re = /^[A-Za-z0-9]+$/;
    return re.test(login);
}

export default ValidateLogin;
