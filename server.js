var express = require("express");
const cors = require ("cors")
const { ethers } = require("ethers"); //Requires necesarios.
const bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: '.' });
});

app.post("/getInterfaceID", function (req, res) {

    data = req.body.abi;

    const iface = new ethers.utils.Interface(data); //Declaramos la interfaz.
    const funcs = iface.functions;
    const keys = Object.keys(funcs); //Agarro las keys de functions, o los nombres de las funciones.

    let sigHashes = [];

    for (func of keys){
        sigHashes.push(iface.getSighash(func)); //Agarro los selectores de las funciones de la interfaz.
    }

    let parsedSigHashes = [];


    sigHashes.forEach(hash => {
        console.log(parseInt(hash, 16));
        parsedSigHashes.push(parseInt(hash, 16));  //Convierto Hex Strings a Ints.
    });

    for(let i = 1; i < parsedSigHashes.length; i++){
        parsedSigHashes[0] = parsedSigHashes[0] ^ parsedSigHashes[i]; //XOR a todos los selectores, Guardo el resultado en hashBuffers[0]
    }

    ret = "0x" + decimalToHexString(parsedSigHashes[0])
    console.log(ret);

    if(ret) {
        res.send(ret);
    }

    else{
        res.sendStatus(204);
    } 

});

app.listen(PORT, () => console.log(`Server running on port: ` + PORT));

function decimalToHexString(number)
{
    if (number < 0)
    {
        number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

