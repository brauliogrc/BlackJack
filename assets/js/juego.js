/**
 * 2C = 2 of Clubs      (Treboles)
 * 2D = 2 of Diamonds   (Diamantes)
 * 2H = 2 of Hearts     (Corazones)
 * 2S = 2 of Spades     (Espadas)
 */

// Patron modulo
const miModulo = (() => {
    'use strict'

    
    let deck            = [];
    const tipos         = ['C', 'D', 'H', 'S'],
          especiales    = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];
    let cantidadCartas = 0;

    // Referencias del HTML
    const btnPedir              = document.querySelector('#btnPedir'),
          btnDeneter            = document.querySelector('#btnDetener'),
          btnNuevo              = document.querySelector('#btnNuevo');

    const divCartasJugadores      = document.querySelectorAll('.divCartas'),
          marcador              = document.querySelectorAll('small');

    // Inicializacion del juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        cantidadCartas = 0;
        
        marcador.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled   = false;
        btnDeneter.disabled = false;
    }

    // Creacion de un nuevo deck
    const crearDeck = () => {
        deck = [];
        for(let i = 2; i <= 10; i++) {
            for(let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for(let tipo of tipos) {
            for(let especial of especiales) {
                deck.push(especial + tipo);
            }
        }

        // Utilizando la libreria underscore de js
        return _.shuffle(deck); // shuffle devuelve un array con los datos ordenados aleatoriamente;
    }

    // Tomar una carta
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop(); // Extraccion de la ultima carta del deck
    }

    // Obtencion del valor de la carta
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1)
        return ( isNaN(valor) ) 
                ? (valor === 'A') ? 11 : 10 
                : valor * 1;
    }

    // Turno: 0 = primer jugador y el ultimo será la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        marcador[turno].innerText = puntosJugadores[turno]; // Mostrando el valor de los puntos en el small
        return puntosJugadores[turno];
    }

    // Creacion de la carta para mostrarla en la pantalla
    const crearCarta = (carta, turno) => {
        // Mostrando la carta arrojada
        // <img src="assets/cartas/red_back.png" alt="Caratula" class="carta">
        const imgCarta  = document.createElement('img'); // Creando la imagen dinamicamente
        imgCarta.src    = `assets/cartas/${carta}.png`;
        imgCarta.alt    = carta;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    // Mustra el mensaje del ganador del juego
    const determinarGanador = () => {
        // Desestructuracion del arreglo
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert('Empate');
            }
            else if (puntosMinimos  > 21) {
                alert('La computadora gana');
            }
            else if (puntosComputadora > 21) {
                alert('Felicidades !!');
            }
            else {
                alert('La computadora gana');
            }
        }, 1000);
    }

    // Turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {
        let puntosComputadora = 0;
        do{
            const carta             = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

            cantidadCartas++;

        }while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }

    // Eventos
    btnPedir.addEventListener('click', () => {  // A la fucnion que se esta pasando como argumente se le llama callback
        const carta             = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        cantidadCartas++;

        if (cantidadCartas < 5) {
            if (puntosJugador > 21) {
                console.warn('Puntos excedidos.');
                btnPedir.disabled       = true;
                btnDeneter.disabled     = true;
                turnoComputadora(puntosJugador);
            }
            else if (puntosJugador === 21) {
                console.warn('21, Excelente!!');
                btnPedir.disabled       = true;
                btnDeneter.disabled     = true;
                turnoComputadora(puntosJugador);
            }
        }
        else {
            console.warn('Limite de cartas alcanzado');
            btnPedir.disabled       = true;
            btnDeneter.disabled     = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDeneter.addEventListener('click', () => {
        btnPedir.disabled       = true;
        btnDeneter.disabled     = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego
    };
    
})();
