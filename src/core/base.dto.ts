interface BaseDTOProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BaseDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: BaseDTOProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
