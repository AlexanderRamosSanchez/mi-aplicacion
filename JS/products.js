let productsTable;

async function initializeProductsTable() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        productsTable = $('#productsTable').DataTable({
            data: products,
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'category' },
                { 
                    data: 'price',
                    render: (data) => `$${parseFloat(data).toFixed(2)}`
                },
                { data: 'stock' },
                {
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${row.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${row.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            responsive: true,
            pageLength: 10,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });
    } catch (error) {
        alert('Error al cargar los productos');
    }
}

// Guardar o actualizar producto
document.getElementById('btnSaveProduct').addEventListener('click', async function() {
    const productForm = document.getElementById('productForm');

    if (!productForm.checkValidity()) {
        productForm.classList.add('was-validated');
        return;
    }

    const productId = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value)
    };

    try {
        const url = productId 
            ? `http://localhost:3000/api/products/${productId}`
            : 'http://localhost:3000/api/products';
        
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            $('#productModal').modal('hide');
            productForm.reset();
            document.getElementById('productId').value = '';
            productsTable.ajax.reload();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

// Editar producto
async function editProduct(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        const product = await response.json();

        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        $('#productModal').modal('show');
    } catch (error) {
        alert('Error al cargar el producto');
    }
}

// Eliminar producto
async function deleteProduct(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                productsTable.ajax.reload();
            } else {
                alert('Error al eliminar el producto');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    }
}