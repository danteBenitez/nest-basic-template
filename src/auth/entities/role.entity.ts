import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export const Roles = {
    USER: 'user',
    ADMIN: 'admin'
} as const;

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    role_id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}