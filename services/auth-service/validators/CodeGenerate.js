export const generateCode = () => {

    const numbers = Math.floor(100 + Math.random() * 900); // 3 números

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomLetters = "";

    for (let i = 0; i < 3; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return `${numbers}${randomLetters}`;
};
