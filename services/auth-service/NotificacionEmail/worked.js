
let queue = [];
let isProcessing = false;
let currentIndex = 0;

export const addToQueue = (data) => {
    queue.push(...data);
};

setInterval(async () => {
    if (isProcessing) return;
    if (queue.length === 0) return;

    isProcessing = true;

    const item = queue.shift();
    currentIndex++;

    let transaction;

    try {
        console.log(`Procesando posición ${currentIndex}`);

        // 🔥 INICIAR TRANSACCIÓN
        transaction = await sequelize.transaction();

        // 1️⃣ Envio Coreo con Mail
        const nuevoProducto = await Producto.create({
            nombre: item.nombre,
            descripcion: item.descripcion,
            precio: item.precio,
            stock: item.stock,
            status: item.status
        }, { transaction });




        console.log(`Finalizado posición ${currentIndex}`);

    } catch (error) {
        console.error("Error procesando:", error);

        // ❌ SI HAY ERROR → REVERSIÓN TOTAL
        if (transaction) await transaction.rollback();

        console.log(`Rollback ejecutado en posición ${currentIndex}`);
    }

    isProcessing = false;

}, 4000);
