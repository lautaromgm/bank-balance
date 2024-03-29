const ingresos = [
  new Ingreso("Sueldo", 150000.0),
  new Ingreso("Venta moto", 100000.0),
  new Ingreso("Transferencia particular", 15000),
];

const egresos = [
  new Egreso("Alquiler", 45000.0),
  new Egreso("Ropa", 15000.0),
  new Egreso("Provista supermercado", 40000.0),
  new Egreso("Impuestos y servicios", 23000.0),
];

let cargarApp = () => {
  cargarCabecero();
  cargarIngresos();
  cargarEgresos();
};

let totalIngresos = () => {
  let totalIngreso = 0;
  for (let ingreso of ingresos) {
    totalIngreso += ingreso.valor;
  }
  return totalIngreso;
};
let totalEgresos = () => {
  let totalEgreso = 0;
  for (let egreso of egresos) {
    totalEgreso += egreso.valor;
  }
  return totalEgreso;
};

let cargarCabecero = () => {
  let presupuesto = totalIngresos() - totalEgresos();
  let porcentajeEgreso = totalEgresos() / totalIngresos();
  document.getElementById("presupuesto").innerHTML = formatoMoneda(presupuesto);
  document.getElementById("porcentaje").innerHTML =
    formatoPorcentaje(porcentajeEgreso);
  document.getElementById("ingresos").innerHTML = formatoMoneda(
    totalIngresos()
  );
  document.getElementById("egresos").innerHTML = formatoMoneda(totalEgresos());
};

const formatoMoneda = (valor) => {
  return valor.toLocaleString("es-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};
const formatoPorcentaje = (valor) => {
  return valor.toLocaleString("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
  });
};

const cargarIngresos = () => {
  let ingresosHTML = "";
  for (let ingreso of ingresos) {
    ingresosHTML += crearIngresoHTML(ingreso);
  }
  document.getElementById("lista-ingresos").innerHTML = ingresosHTML;
};
const cargarEgresos = () => {
  let egresosHTML = "";
  for (let egreso of egresos) {
    egresosHTML += crearEgresoHTML(egreso);
  }
  document.getElementById("lista-egresos").innerHTML = egresosHTML;
};

const crearIngresoHTML = (ingreso) => {
  let ingresoHTML = `
                <div class="elemento limpiarEstilos">
                    <div class="elemento_descripcion">${
                      ingreso.descripcion
                    }</div>
                    <div class="derecha limpiarEstilos">
                        <div class="elemento_valor">+ ${formatoMoneda(
                          ingreso.valor
                        )}</div>
                        <div class="elemento_eliminar">
                            <button class='elemento_eliminar--btn'>
                                <ion-icon name="close-circle-outline" 
                                onclick ='eliminarIngreso(${
                                  ingreso.id
                                })'></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
    `;
  return ingresoHTML;
};

const eliminarIngreso = (id) => {
  let indiceEliminar = ingresos.findIndex((ingreso) => ingreso.id === id);
  ingresos.splice(indiceEliminar, 1);
  cargarCabecero();
  cargarIngresos();
};

const crearEgresoHTML = (egreso) => {
  let egresoHTML = `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
            <div class="elemento_porcentaje">${formatoPorcentaje(
              egreso.valor / totalEgresos()
            )}</div>
            <div class="elemento_eliminar">
                <button class='elemento_eliminar--btn'>
                    <ion-icon name="close-circle-outline" 
                    onclick ='eliminarEgreso(${egreso.id})'></ion-icon>
                </button>
            </div>
        </div>
    </div>
    `;
  return egresoHTML;
};

const eliminarEgreso = (id) => {
  let indiceEliminar = egresos.findIndex((egreso) => egreso.id === id);
  egresos.splice(indiceEliminar, 1);
  cargarCabecero();
  cargarEgresos();
};

let agregarDato = () => {
  let forma = document.forms["forma"];
  let tipo = forma["tipo"];
  let descripcion = forma["descripcion"];
  let valor = forma["valor"];
  if (descripcion.value !== "" && valor.value !== "") {
    if (tipo.value === "ingreso") {
      ingresos.push(new Ingreso(descripcion.value, +valor.value));
      cargarCabecero();
      cargarIngresos();
    } else if (tipo.value === "egreso") {
      egresos.push(new Egreso(descripcion.value, +valor.value));
      cargarCabecero();
      cargarEgresos();
    }
  }
};
let calcularPlazo = () => {
  let forma2 = document.forms["forma2"];
  let resultado = 0;
  let selTarifa = forma2["sel_tarifa"].value;
  let tarifa = forma2["tarifa"].value;
  let tiempo = forma2["tiempo"].value;
  let importe = forma2["importe"].value;
  let presupuestoActual = totalIngresos() - totalEgresos();
  if (importe <= presupuestoActual) {
    if (importe > 0) {
      if (selTarifa === "anual") {
        if (tiempo == 12) {
          resultado = importe * (tarifa / 100);
          console.log(tarifa);
          ingresos.push(new Ingreso("Renta por plazo fijo", resultado));
          cargarCabecero();
          cargarIngresos();
        } else {
          resultado = importe * (((tarifa / 100) * (tiempo * 30)) / 365);

          console.log(tarifa);
          ingresos.push(new Ingreso("Renta por plazo fijo", resultado));
          cargarCabecero();
          cargarIngresos();
        }
      }
      if (selTarifa === "mensual") {
        resultado = importe * ((tarifa / 100) * tiempo);
        console.log(tarifa);
        ingresos.push(new Ingreso("Renta por plazo fijo", resultado));
        cargarCabecero();
        cargarIngresos();
      }
    } else {
      alert("El importe debe ser superior a 0");
    }
  } else {
    alert("Importe superior al presupuesto");
  }
};
