import { Role } from "@/auth/entities/role.entity";
import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Expose({ name: 'username', toPlainOnly: true })
    @Column()
    name: string;

    @Expose({ name: 'e-mail', toPlainOnly: true })
    @Column()
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    // A user can have only one role
    @ManyToMany(() => Role)
    @JoinTable()
    @Expose({ name: 'user_roles', toPlainOnly: true })
    roles: Role[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}