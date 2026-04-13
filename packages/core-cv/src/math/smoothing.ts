import { Point2D } from "@salvagente/shared-types";

export class Smoother {
  private currentX = 0;
  private currentY = 0;
  private dmp: number;

  constructor(dmp: number = 0.2) {
    this.dmp = dmp;
  }

  next(targetX: number, targetY: number): Point2D {
    this.currentX += (targetX - this.currentX) * this.dmp;
    this.currentY += (targetY - this.currentY) * this.dmp;
    return { x: this.currentX, y: this.currentY };
  }
  
  reset(x: number, y: number) {
    this.currentX = x; 
    this.currentY = y;
  }
}
