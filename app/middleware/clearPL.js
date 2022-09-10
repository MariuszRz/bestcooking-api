const clearPL = (string) => {
    return string
        .replace(/ą/g, "a")
        .replace(/ć/g, "c")
        .replace(/ę/g, "e")
        .replace(/ł/g, "l")
        .replace(/ń/g, "n")
        .replace(/ó/g, "o")
        .replace(/ś/g, "s")
        .replace(/ż/g, "z")
        .replace(/ź/g, "z")
        .replace(/ /g, "-")
        .replace(/"/g, "")
        .replace(/;/g, "-")
        .replace(/\?/g, "")
        .replace(/\//g, "-");

};

module.exports = clearPL;
