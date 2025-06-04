export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: { id: string; createdAt: Date; updatedAt: Date }) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
