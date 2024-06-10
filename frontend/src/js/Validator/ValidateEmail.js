
const ValidateEmail = (email) =>
{
    const re = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
    return re.test(email);
}



export default ValidateEmail;
