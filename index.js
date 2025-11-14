const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())

const ola = (request, response) => {
    response.status(200).json("Seja bem vindo ao express")
}

const addProdutos = async (request, response) => {
    try {
        const {nmProduto, dsProduto, qtProduto, vlProduto, dtCadastro} = request.body;
        console.log({nmProduto, dsProduto, qtProduto, vlProduto, dtCadastro});
        let sql = `INSERT INTO produtos (nmproduto, dsproduto, qtproduto, vlproduto, dtCadastro)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING idproduto, nmproduto, dsproduto, qtproduto, vlproduto, to_char(dtCadastro, 'DD/MM/YYYY') AS dtCadastro`;
        
        const results = await pool.query(sql, [nmProduto, dsProduto, qtProduto, vlProduto, dtCadastro]);
        if (results.rows[0]) {
            return response.status(200).json(
                {
                    status: "success",
                    message: "success",
                    objeto: results.rows[0]
                }
            );
        }
    } catch (error) {
        return response.status(400).json(
            {
                status: "error",
                message: 'error: ' + error
            }
        )
    }
}

const pegadados = (request, response) => {
    const {nome, profissao} = request.body;

    response.status(200).json({nome: nome, profissao: profissao});
}

app.route("/opa").get(ola).post(pegadados)
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(3002, () => {
    console.log('rodano na 3002');
});