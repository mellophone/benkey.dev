import { IsoCell } from "../../Cells";

export default class EntityCell {
  constructor(
    public cell: IsoCell,
    public collision: boolean = true,
    public render: boolean = false,
    public interaction?: string
  ) {}
}
