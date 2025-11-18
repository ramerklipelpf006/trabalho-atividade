const express = require('express');
const cors = require('cors');
const {pool} = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())

const getAllAtividades = async (request, response) => {
    try {
        let sql = `SELECT *
                   FROM atividade`;
        
        const results = await pool.query(sql);
        if (results.rows[0]) {
            return response.status(200).json({data: results.rows});
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

const getAtividade = async (request, response) => {
    try {
        
        const idAtividade = parseInt(request.params.idAtividade);

        let sql = `SELECT *
                   FROM atividade
                   WHERE idAtividade = $1`;
        
        const results = await pool.query(sql, [idAtividade]);
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

const insertAtividade = async (request, response) => {
    try {
        const {nmAtividade, dsAtividade, flAtivo, daAtividade} = request.body;
        
        let sql = `INSERT INTO atividade (nmAtividade, dsAtividade, flAtivo, daAtividade)
                   VALUES ($1, $2, $3, $4)
                   RETURNING idAtividade, nmAtividade, dsAtividade, flAtivo, to_char(daAtividade, 'DD/MM/YYYY') AS daAtividade`;
        
        const results = await pool.query(sql, [nmAtividade, dsAtividade, flAtivo, daAtividade]);
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

const updateProduto = async (request, response) => {
    try {
        const {idAtividade, nmAtividade, dsAtividade, flAtivo, daAtividade} = request.body;
        console.log({idAtividade, nmAtividade, dsAtividade, flAtivo, daAtividade});

        let sql = `UPDATE atividade
                   set 
                      nmAtividade = $1,
                      dsAtividade = $2,
                      flAtivo = $3,
                      daAtividade = $4
                   WHERE idAtividade = $5
                   RETURNING idAtividade, nmAtividade, dsAtividade, flAtivo, to_char(daAtividade, 'DD/MM/YYYY') AS daAtividade`;
        
        const results = await pool.query(sql, [nmAtividade, dsAtividade, flAtivo, daAtividade, idAtividade]);
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

const deletaAtividade = async (request, response) => {
    try {
        const {idAtividade} = request.params.idAtividade;

        let sql =  `DELETE 
                    FROM atividade
                    WHERE idAtividade = $1`;
        const results = await pool.query(sql, [idAtividade]);

        return response.status(200).json(
            {
                status: "success",
                message: "success",
            }
        );
    } catch (error) {
        return response.status(400).json(
            {
                status: "error",
                message: 'error: ' + error
            }
        )
    }
}

app.route("/atividade").get(getAllAtividades);
app.route("/atividade/:idAtividade").get(getAtividade).post(updateProduto).put(insertAtividade).delete(deletaAtividade);

app.listen(3002, () => {
    console.log('rodando na 3002');
});