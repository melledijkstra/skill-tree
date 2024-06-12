export class Logger {
  private readonly name: string;
  public enabled: boolean = true;

  constructor(name: string) {
    this.name = name;
  }

  log(...data: any[]): void {
    console.log(`${this.name}>`, ...data);
  }

  error(...data: any[]): void {
    console.error(`${this.name}>`, ...data);
  }

  debug(...data: any[]): void {
    if (this.enabled) {
      console.debug(`${this.name}>`, ...data);
    }
  }
}
