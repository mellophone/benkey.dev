export default class Mover {
  private up: boolean = false;
  private left: boolean = false;
  private down: boolean = false;
  private right: boolean = false;

  constructor(
    private upKey: string,
    private leftKey: string,
    private downKey: string,
    private rightKey: string
  ) {}

  public updateMoverState = (key: string, active: boolean) => {
    switch (key) {
      case this.upKey:
        this.up = active;
        return;
      case this.leftKey:
        this.left = active;
        return;
      case this.downKey:
        this.down = active;
        return;
      case this.rightKey:
        this.right = active;
        return;
    }
  };

  public getXMovement = () => (this.right ? 1 : 0) + (this.left ? -1 : 0);

  public getYMovement = () => (this.down ? 1 : 0) + (this.up ? -1 : 0);
}
