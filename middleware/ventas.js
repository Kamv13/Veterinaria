const db = require('../config/db');

// Registro de una venta
function registrarVenta(req, res) {
    const {  id_cliente, total, detalle } = req.body;
    const id_usuario=req.user.id;
    const fecha=new Date(Date.now() - 6 * 60 * 60 * 1000)
                            .toISOString()
                            .slice(0, 19)
                            .replace('T', ' ');

    // Validaciones
    if (!id_cliente || !total || !detalle || !Array.isArray(detalle) || detalle.length === 0) {
        return res.status(400).json({ 
            error: 'Faltan datos requeridos: id_cliente, total, detalle' 
        });
    }

    // Insertamos el nuevo usuario en la base de datos
    db.query(
        'INSERT INTO venta (id_usuario, id_cliente, fecha, total) VALUES (?, ?, ?, ?)',
        [id_usuario, id_cliente, fecha, total],
        (err, result) => {
            if (err) {
                console.error('Error al insertar venta:', err);
                return res.status(500).json({ error: err.message });
            }
            
            // Obtener el ID de la venta insertada
            const id_venta = result.insertId;
            
            // Insertar detalles de la venta
            insertarDetalle(id_venta, detalle, res);
        }
    );
}


//  Función para insertar el detalle de la venta
function insertarDetalle(id_venta, detalle, res) {
    // Preparar datos para inserción múltiple
    const valores = detalle.map(item => [
        id_venta,
        item.id_producto,
        item.cantidad,
        item.subtotal
    ]);
    
    // Query para inserción múltiple
    const query = 'INSERT INTO detalleventa (id_venta, id_producto, cantidad, subtotal) VALUES ?';
    
    db.query(query, [valores], (err, result) => {
        if (err) {
            console.error('Error al insertar detalle:', err);
            
            // Si falla el detalle, eliminar la venta (rollback manual)
            db.query('DELETE FROM venta WHERE id = ?', [id_venta], (deleteErr) => {
                if (deleteErr) console.error('Error al eliminar venta:', deleteErr);
            });
            
            return res.status(500).json({ 
                error: 'Error al registrar detalle de venta: ' + err.message 
            });
        }
        
        // Todo exitoso
        res.json({ 
            message: 'Venta registrada exitosamente',
            id_venta: id_venta,
            detalles_insertados: result.affectedRows
        });
    });
}

// Obtener ventas
function obtenerVentas(req, res) {
    const sql =  `
        SELECT 
            v.id,
            v.id_usuario,
            v.id_cliente,
            v.fecha,
            v.total,
            u.nombre as usuario_nombre,
            c.nombre as cliente_nombre
        FROM venta v
        LEFT JOIN usuario u ON v.id_usuario = u.id
        LEFT JOIN cliente c ON v.id_cliente = c.id
        ORDER BY v.fecha DESC
    `;

    db.query(sql, (err, results)=>{
        if(err){
            res.status(500).json({status:500, message:'Error en la consulta..'});
        }
        else{
            res.status(200).json({status:200, message:'success', data:results});
        }
    });
}

// Obtener ventas
function obtenerDetalleVenta(req, res) {
    const id_venta = req.params.id;
    
    // Validar que el parámetro existe
    if (!id_venta) {
        return res.status(400).json({
            status: 400, 
            message: 'ID de venta requerido'
        });
    }

    const sql = `
        SELECT 
            dv.id,
            dv.id_venta,
            dv.id_producto,
            dv.cantidad,
            dv.subtotal,
            p.nombre as producto_nombre,
            p.precio as producto_precio
        FROM detalleventa dv
        LEFT JOIN producto p ON dv.id_producto = p.id
        WHERE dv.id_venta = ?
    `;
    
    db.query(sql, [id_venta], (err, results)=>{
        if(err){
            res.status(500).json({status:500, message:'Error en la consulta..'});
        }
        else{
            res.status(200).json({status:200, message:'success', data:results});
        }
    });
}
// Obtener productos
function obtenerProductos(req, res) {
    const sql = "select * from producto";

    db.query(sql, (err, results)=>{
        if(err){
            res.status(500).json({status:500, message:'Error en la consulta..'});
        }
        else{
            res.status(200).json({status:200, message:'success', data:results});
        }
    });
}

// Obtener clientes
function obtenerClientes(req, res) {
    const sql = "select * from cliente";

    db.query(sql, (err, results)=>{
        if(err){
            res.status(500).json({status:500, message:'Error en la consulta..'});
        }
        else{
            res.status(200).json({status:200, message:'success', data:results});
        }
    });
}



module.exports = { registrarVenta, obtenerVentas, obtenerProductos,obtenerDetalleVenta,obtenerClientes };
