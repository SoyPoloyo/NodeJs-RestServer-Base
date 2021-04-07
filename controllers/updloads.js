const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


//subir imagenes al servidor
const cargarArchivo = async (req, res = response) => {


    try {

        //const nombreArchivo = await subirArchivo(req.files, ['txt', 'md'], 'casa');
        //undefiniend para no mandar el argumento pero esta en el medio
        const nombreArchivo = await subirArchivo(req.files, undefined, 'img');

        res.json({
            nombre: nombreArchivo
        })

    } catch (msg) {
        return res.status(400).json({
            msg
        })
    }


}

//actualizar imagenes de el servidor local,
const actualizarImg = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;


    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    // Limpiar imagen previa
    if (modelo.img) {
        //Borrar la imagen del servidor

        //obtenemos la ruta
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        // preguntamos si existe y si existe la borramos
        if (fs.existsSync(pathImagen)) {// vemos si existe
            fs.unlinkSync(pathImagen); //borramos la imagen
        }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombreArchivo

    await modelo.save();

    res.json(modelo);

}

//actualizar imagenes usando cloudinary
const actualizarImgCloudinary = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;
    let folder = "NodeJs-RestServer"


    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    // Limpiar imagen previa
    if (modelo.img) {
        //Borrar la imagen antigua del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];

        const [public_id] = nombre.split('.');
        console.log(public_id);

        await cloudinary.uploader.destroy(folder+'/'+coleccion+'/'+ public_id);
    }

    //console.log(req.files.archivo);
    const { tempFilePath } = req.files.archivo // los archivos se guardan temporalmente en un archivo, ese se puede subir

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: folder+'/'+coleccion }) // subir la iamgen a cloudinary, sube el path en resumen

    modelo.img = secure_url

    await modelo.save();

    res.json(modelo);

}

const mostrarImagen = async (req, res = response) => {

    // se podria crear un helper que retorne el modelo** pero que tigra...


    const { coleccion, id } = req.params;

    let modelo;


    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido programar esto' });

    }

    // Limpiar imagen previa
    if (modelo.img) {
        //Borrar la imagen del servidor

        //obtenemos la ruta
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        // preguntamos si existe y si existe la borramos
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }

    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);


}

module.exports = {
    cargarArchivo,
    actualizarImg,
    mostrarImagen,
    actualizarImgCloudinary

}