// Declaración de variables globales
const porcentajeJubilacion = 0.11
const porcentajeObraSocial = 0.03
const porcentajePami = 0.03

let nombre
let mes

// Función que saluda al usuario y pide datos personales
function inicio(){
    alert("💸 Bienvenido al programa de cálculo de sueldos")
    nombre = prompt("👋🏽 Por favor, ingresa tu nombre para continuar:")
    mes = prompt("🗓 Indicá el mes a liquidar (ej: febrero 2023):", 'febrero 2023')

    menu()
}

// Función que presenta al usuario las opciones
function menu(){
    let opcion
    let continuaMenu = true

    do {
        opcion = prompt( nombre + ", por favor, selecciona una de las opciones disponibles:" +
                "\n 1. Elegir convenio colectivo de trabajo" +
                "\n 2. Ingresar la cantidad de días trabajadas" +
                "\n 3. Ingresar horas extras" +
                "\n 4. Finalizar cálculo" +
                "\n 5. Salir"
        )

        switch (opcion){
            case '1':
                seleccionaCCT()
                break
            case '2':
                ingresaDias()
                break
            case '3':
                ingresaHorasExtras()
                break
            case '4':
                let resultado = calcularSueldo()
                if (resultado) continuaMenu = salir()
                break
            case '5':
                continuaMenu = salir()
                break
        }


    } while (continuaMenu)
}

let convenio
let salarioBase

function seleccionaCCT() {
    let continuaMenu = true
    let intentaNuevamente = ''

    do {
        opcion = prompt( intentaNuevamente + "Selecciona tu convenio de colectivo de trabajo:" +
                        "\n 1. Empleados de comercio (CCT N° 130/75)" +
                        "\n 2. Empleados bancarios (CCT N° 18/75)" +
                        "\n 3. Panaderos (CCT N° 231/94)" +
                        "\n 4. Sin convenio colectivo"
        )

        switch (opcion) {
            case "1":
                convenio = 'comercio'
                salarioBase = 170_000
                break
            case "2":
                convenio = 'bancario'
                salarioBase = 250_000
                break
            case "3":
                convenio = 'panadero'
                salarioBase = 160_000
                break
            case "4":
                convenio = 'sin'
                salarioBase = 200_000
                break
        }

        if (convenio != undefined) {
            // alert('✅ Convenio seleccionado: ' + convenio + ' ' + salarioBase)
            continuaMenu = false
        } else {
            intentaNuevamente = '⚠ Opción incorrecta, intenta nuevamente.\n\n'
        }

    } while (continuaMenu)
}


const diasSueldo = 30
let diasTrabajados

function ingresaDias() {
    do {
        diasTrabajados = Number(prompt('🕓 Ingresá la cantidad de días que trabajaste en ' + mes + ':'))
    } while (diasTrabajados <= 0 || diasTrabajados > 30 || isNaN(diasTrabajados))

    alert('✅ Se han ingresado ' + diasTrabajados + ' días.')
}

const ponderadorExtrasSemana = 1.5
const ponderadorExtrasFinde = 2
let hsExtSemana = 0
let hsExtFinde = 0

function ingresaHorasExtras(){
    let opcion
    let continuaMenu = true

    do {
        opcion = prompt('¿En qué momento realizaste las horas extras?' +
                    '\n 1.En la semana' +
                    '\n 2.Durante el fin de semana' +
                    '\n\n (0 ó cancelar para detener el ingreso de información)'
        )

        switch (opcion) {
            case '1':
                hsExtSemana = solicitarHoras()
                alert('✅ Se han ingresado ' + hsExtSemana + ' horas extras realizadas en la semana.')
                break
            case '2':
                hsExtFinde = solicitarHoras()
                alert('✅ Se han ingresado ' + hsExtFinde + ' horas extras realizadas en el fin de semana.')
                break
            case '0':
            case null:
                continuaMenu = false
        }

    } while (continuaMenu)
}

function solicitarHoras() {
    let horas = 0

    do {
        horas = Number(prompt('➕ Ingresá la cantidad de horas extras que realizaste:'))
    } while (horas <= 0 || isNaN(horas))

    return horas
}

function currencyFormat (num) { // Fuente: https://stackoverflow.com/a/32086781
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function calcularSueldo() {
    // Validación de que están todos los datos
    if ([nombre, mes, convenio, diasTrabajados].indexOf(undefined) != -1) {
        alert('🔴 Falta alguno de los siguientes datos:\nNombre\nMes\nConvenio\nDías trabajados')
        return false
    }

    let salarioMes = 0

    // Salario base
    let sueldoBasico = salarioBase / diasSueldo * diasTrabajados
    salarioMes += sueldoBasico

    // Valor hora
    let valorHora = salarioBase / 200

    // Adición de horas extras
    let valorExtraSemana = ponderadorExtrasSemana * hsExtSemana * valorHora
    let valorExtraFinde = ponderadorExtrasFinde * hsExtFinde * valorHora

    salarioMes += valorExtraSemana + valorExtraFinde

    // Salario BRUTO
    let bruto = salarioMes

    // Determinación de aportes sobre sueldo
    let jubilacion = bruto * porcentajeJubilacion
    let obraSocial = bruto * porcentajeObraSocial
    let pami = bruto * porcentajePami

    let aportes = jubilacion + obraSocial + pami

    // Determinación del salario NETO
    let neto = bruto - aportes

    // Recibo de sueldo
    let recibo = `RECIBO DE HABERES\n` +
                `-----------------------\n` +
                `Empleado: ${nombre}\n` +
                `Periodo liquidado: ${mes}\n` +
                `Convenio Colectivo: ${convenio}\n\n` +
                `Sueldo básico (${diasTrabajados} días): ${ currencyFormat(sueldoBasico) }\n` +
                `Hs. Extras 150% (${hsExtSemana} hs): ${ currencyFormat(valorExtraSemana) }\n` +
                `Hs. Extras 200% (${hsExtFinde} hs): ${ currencyFormat(valorExtraFinde) }\n` +
                ` > SUELDO BRUTO: ${ currencyFormat(bruto) }\n\n` +
                `Aporte Jubilación (11%): ${ currencyFormat(-jubilacion) }\n` +
                `Aporte Obra Social (3%): ${ currencyFormat(-obraSocial) }\n` +
                `Aporte PAMI (3%): ${ currencyFormat(-pami) }\n` +
                ` > SUELDO NETO: ${ currencyFormat(neto) }\n`

    alert(recibo)
    return true
}

function salir() {
    alert('Gracias por utilizar el programa. Vuelva prontos! 💪🏽')
    return false
}

inicio()
