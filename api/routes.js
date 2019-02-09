const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

router.get('/', function (req, res) {
    req.con.query('SELECT * FROM node_crud ORDER BY id DESC', function (err, rows) {
        // console.log(rows)
        res.json(rows)
    })
})

router.get('/create', function (req, res) {
    res.render('data/create')
})

//set storage engine
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
// react-crud-mysql\public\images\ajax.JPG
//init upload
let upload = multer({ storage: storage }).single('foto')

router.post('/create', function (req, res) {
    upload(req, res, err => {
        if (err) {
            res.json(err)
        }

        const data = req.body

        req.con.query(`INSERT INTO node_crud SET nama = '${data.nama}', alamat = '${data.alamat}', telepon = '${data.telepon}',  jk = '${data.jk}', foto = '${req.file.filename}' `, function (err) {
            res.status(200).json({ 'data': 'data in added successfully' });
        })
    })
})

router.get('/edit/:id', function (req, res) {
    req.con.query(`SELECT * FROM node_crud WHERE id = ${req.params.id} `, function (err, rows) {
        res.json(rows[0])
    })
})

router.post('/edit/:id', function (req, res) {

    upload(req, res, err => {
        const data = req.body

        if (req.file == undefined) {
            req.con.query(`UPDATE node_crud SET nama = '${data.nama}', alamat = '${data.alamat}', telepon = '${data.telepon}', jk = '${data.jk}' WHERE id = ${req.params.id} `, function (err) {
                res.status(200).json({ 'data': 'data in updated successfully' });
            })
        } else {
            req.con.query(`SELECT foto FROM node_crud WHERE id = ${req.params.id} `, function (err, result, fields) {
                const namaFoto = result[0].foto
                // console.log(result)
                req.con.query(`DELETE foto FROM node_crud WHERE id = ${req.params.id} `, function (err) {
                    fs.unlink("./public/images/" + namaFoto, (err) => {
                        if (err) throw err
                        req.con.query(`UPDATE node_crud SET nama = '${data.nama}', alamat = '${data.alamat}', telepon = '${data.telepon}', jk = '${data.jk}', foto = '${req.file.filename}' WHERE id = ${req.params.id} `, function (err) {
                            res.status(200).json({ 'data': 'data in updated successfully' });
                        })
                    })
                })

            })
        }

    });
})

router.get('/hapus/:id', function (req, res) {

    req.con.query(`SELECT foto FROM node_crud WHERE id = ${req.params.id} `, function (err, result, fields) {
        const namaFoto = result[0].foto
        // console.log(namaFoto)
        req.con.query(`DELETE FROM node_crud WHERE id = ${req.params.id} `, function (err) {
            fs.unlink("./public/images/" + namaFoto, (err) => {
                if (err) {
                    res.status(493).json({ 'failed': "Deleted Failed" })
                } else {
                    res.status(200).json({ 'sukses': "Deleted Successfully" })
                }
            });
        })

    })
})

module.exports = router