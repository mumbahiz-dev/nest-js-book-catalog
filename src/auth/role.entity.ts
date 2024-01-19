import { BaseEntity } from "src/common/abstrat-base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "role" })
export class Role extends BaseEntity {
  @Column({ name: "name" })
  name: string;

  @Column({ name: "desciption" })
  description: string;
}
