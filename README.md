 # Desarrollo Especial Lotes

## Objetivo: 

Desarrollar funcionabilidad de la aplicación pos_lot_selection para el uso de la misma sin conexión a internet.     

## Requerimiento Necesario:

Todas la modificaciones deben realizarse en una sola aplicación (pos_lot_selection), se debe utilizar herencia, extención de objeto, modificaciones, sin codificacion intrusivas a otros módulos de la plataforma Odoo

## Metodología de Trabajo : 

### Fase de Desarrllo : 

Actividad  | Descripcion
------------- | -------------
1- Diagnosticar archivos, objetos y métodos necesarios | Información necesaria para la modificacion y extención de código
2- Desarrollar representación del modelo stock_quant | Ubicar campos necesarios Anexo 1
3- Cargar de la representación del modelo stock_quant en Caché | Desarrollo crítico , ya que de esta actividad depende el resto de función de la APP Anexo 1
4- Prueba de Caja Negra 1 | 
5- Captura Información de cache | La captura se realiza en el metodo compute_lot_lines y es procesada por el metodo get_lot archivo models
6- Hacer uso de la información captura en método específico | metodo get_lot
7- Filtrar objeto obtenido y listar solo los productos disponibles para la venta | 
8- Agregar info extra al array product_lot (name) | Este array es el que almacena la informacion sobre los lotes del producto y es enviada al template xml visualizada en el popup del punto de venta
9- Comprobar envio de produc_lot, captura y render xml | 
10-Corrección de error n 001 | En el objeto stock_quant envia al método get_lot, se debe filtrar la información para leer solo los lotes y productos serial que se encuentre en la ubicación != a Almacen / Cliente
11-Corrección de error n 002 | Parametrización incorrecta en prodcut?lot.push

### Fase de Prueba : 

#### Black Box / Test de Caja Negra

Pruebas a nivel de código 

Actividad | Descripcion 
------------- | -------------
 1- Carga de representación de modelo en cache | Verificar si la carga de la representacion del modelo stock_quante y campos, se realiza de manera satisfactoria al cargar el punto de venta en el navegador Anexo 1
 2- Errorn 001 encontrado en test | El input que lista los producto de lotes, muestra lotes que ya fueron vendidos y disponibles 
 3- Seguimiento de variables, métodos | Comportamiento a nivel de codigo de las aplicacion
 3- Errorn 002 encontrado en test | Variables indefinidas en clave de product_lot
 
#### White Box / Test de Caja Blanca

 Pruebas funcionales a nivel de usuario

Actividad | Descripcion 
------------- | -------------
 1- Pruebas con Conexión a Internet |
 1.1 Carga en línea de orden productos lotes / serial  | Verificar si la cargade de produstos tipo lotes / serial se esta realizando de manera correcta
 1.2. Eliminar en línea de orden productos lotes / serial  | Verificar si la cargade de produstos tipo lotes / serial se esta realizando de manera correcta
 1.3. Variante el producto tipo lote  | seleccionar diferentes lotes , diferentes cantidades
 1.4. Variante el producto tipo serial  | seleccionar diferentes cantidad y asignarles un número de serial unica para cada producto
 1.5. Completar proceso de compra  | Proceso standar 
 1.6. Seleccionar productos tipo lotes | Verficar si las cantidades de producto han sido descontadas para el lote que corresponda
 1.7. Seleccionar productos tipo Serial | Verficar si los productos tipos serial vendidos en la orden de venta anterior aún aparece su código, el Flujo correcto del programa es que estos producto no deben aparecer ya que, ya fueron vendido
 1.8. Dirigirse al Backend de la plataforma Odoo aplicaacion de Inventario |  Diagnosticar en inventario que los productos han sido descontandos de forma correcta y de acuerdo a las instrucciones enviadas por el punto de venta, verificar orden de pedido
 2-Pruebas sin Conexión a Internet |
 2.1 Diagnosticar funcionalidad de la APP sin conexión a internet | Realizar actividades 1.1 hasta la actividad 1.7
 
 ## Anexos
 
 ### Anexo 1, Carga de modelos en cache 

![](https://github.com/gtica/Requerimiento_LOTES/blob/master/img/Selecci%C3%B3n_756.png)
![](https://github.com/gtica/Requerimiento_LOTES/blob/master/img/Selecci%C3%B3n_757.png)
![](https://github.com/gtica/Requerimiento_LOTES/blob/master/img/Selecci%C3%B3n_758.png)
     

---------------------
---------------------
