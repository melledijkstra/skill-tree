export class UI {
  public static setConstellationName(name: string): void {
    const elem = document.getElementById('constellation-name');
    if (elem) {
      elem.textContent = name;
    }
  }
}
