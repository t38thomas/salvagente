import { Point3D } from "@salvagente/shared-types";

export class PinchDetector {
  private isPinching = false;
  
  constructor(public thresOn: number, public thresOff: number) {}

  update(thumb: Point3D, index: Point3D): boolean {
    const dist = Math.hypot(thumb.x - index.x, thumb.y - index.y, thumb.z - index.z);
    
    if (!this.isPinching && dist < this.thresOn) {
      this.isPinching = true;
    } else if (this.isPinching && dist > this.thresOff) {
      this.isPinching = false;
    }
    return this.isPinching;
  }
}
