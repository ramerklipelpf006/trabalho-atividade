const express = require('express');
const cors = require('cors');
const {pool} = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())

const getAllatividades = async (request, response) => {
    try {
        let sql = `SELECT idatividade, nmatividade, dsatividade, flativo, to_char(daatividade, 'yyyy-MM-dd') daatividade
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

const getatividade = async (request, response) => {
    try {
        
        const idatividade = parseInt(request.params.idatividade);

        let sql = `SELECT idatividade, nmatividade, dsatividade, flativo, to_char(daatividade, 'yyyy-MM-dd') daatividade
                   FROM atividade
                   WHERE idatividade = $1`;
        
        const results = await pool.query(sql, [idatividade]);
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
        const {nmatividade, dsatividade, flativo, daatividade} = request.body;

        let sql = `INSERT INTO atividade (nmatividade, dsatividade, flativo, daatividade)
                   VALUES ($1, $2, $3, $4)
                   RETURNING idatividade, nmatividade, dsatividade, flativo, to_char(daatividade, 'yyyy-MM-dd') AS daatividade`;
        
        const results = await pool.query(sql, [nmatividade, dsatividade, flativo, daatividade]);
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
        const {idatividade, nmatividade, dsatividade, flativo, daatividade} = request.body;

        let sql = `UPDATE atividade
                   set 
                      nmatividade = $1,
                      dsatividade = $2,
                      flativo = $3,
                      daatividade = $4
                   WHERE idatividade = $5
                   RETURNING idatividade, nmatividade, dsatividade, flativo, to_char(daatividade, 'yyyy-MM-dd') AS daatividade`;
        
        const results = await pool.query(sql, [nmatividade, dsatividade, flativo, daatividade, idatividade]);
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

const deletaatividade = async (request, response) => {
    try {
        const idatividade = request.params.idatividade;
        let sql =  `DELETE 
                    FROM atividade
                    WHERE idatividade = $1`;
        await pool.query(sql, [idatividade]);
        console.log(
            {'idatividade': idatividade,
            'request.params.idatividade': request.params.idatividade,
                'sql': sql,
        })
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

app.route("/atividade").get(getAllatividades).post(insertAtividade).put(updateProduto);
app.route("/atividade/:idatividade").get(getatividade).delete(deletaatividade);

app.listen(3002, () => {
    console.log('rodando na 3002');
});