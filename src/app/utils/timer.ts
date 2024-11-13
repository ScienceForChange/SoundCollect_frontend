export class Timer {
  private intervalId: any;
  private tiempoInicial: number;
  private tiempoRestante: number;
  private estado: 'iniciado' | 'pausado' | 'detenido';

  constructor(tiempoInicial: number) {
    this.tiempoInicial = tiempoInicial;
    this.tiempoRestante = tiempoInicial;
    this.estado = 'detenido';
  }

  private formatearTiempo(tiempo: number): string {
    const horas = Math.floor(tiempo / 3600);
    const minutos = Math.floor((tiempo % 3600) / 60);
    const segundos = tiempo % 60;
    return `${this.agregarCero(horas)}:${this.agregarCero(minutos)}:${this.agregarCero(segundos)}`;
  }

  private agregarCero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  iniciar() {
    if (this.estado === 'detenido') {
      this.estado = 'iniciado';
      this.intervalId = setInterval(() => {
        this.tiempoRestante--;
        if (this.tiempoRestante <= 0) {
          this.detener();
        }
      }, 1000);
    } else if (this.estado === 'pausado') {
      this.estado = 'iniciado';
      this.intervalId = setInterval(() => {
        this.tiempoRestante--;
        if (this.tiempoRestante <= 0) {
          this.detener();
        }
      }, 1000);
    }
  }

  pausar() {
    if (this.estado === 'iniciado') {
      clearInterval(this.intervalId);
      this.estado = 'pausado';
    }
  }

  continuar() {
    if (this.estado === 'pausado') {
      this.estado = 'iniciado';
      this.intervalId = setInterval(() => {
        this.tiempoRestante--;
        if (this.tiempoRestante <= 0) {
          this.detener();
        }
      }, 1000);
    }
  }

  detener() {
    clearInterval(this.intervalId);
    this.estado = 'detenido';
    this.tiempoRestante = this.tiempoInicial;
  }

  obtenerTiempoRestante(): string {
    return this.formatearTiempo(this.tiempoRestante);
  }

  obtenerEstado() {
    return this.estado;
  }
}
