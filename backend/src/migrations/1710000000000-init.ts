import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class Init1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // roles
    await queryRunner.createTable(new Table({
      name: 'roles',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'name', type: 'varchar', length: '255', isNullable: false, isUnique: true }
      ]
    }))

    // users
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'username', type: 'varchar', length: '255', isNullable: false },
        { name: 'passwordHash', type: 'varchar', length: '255', isNullable: false },
        { name: 'roleId', type: 'varchar', length: '36', isNullable: false },
        { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
        { name: 'updatedAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' }
      ]
    }))
    await queryRunner.createIndex('users', new TableIndex({ name: 'IDX_users_username_unique', columnNames: ['username'], isUnique: true }))
    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: ['roleId'], referencedTableName: 'roles', referencedColumnNames: ['id'], onDelete: 'RESTRICT', onUpdate: 'CASCADE'
    }))

    // tickets
    await queryRunner.createTable(new Table({
      name: 'tickets',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'customerWaId', type: 'varchar', length: '255', isNullable: false },
        { name: 'subject', type: 'varchar', length: '255', isNullable: false },
        { name: 'status', type: 'varchar', length: '20', isNullable: false, default: "'open'" },
        { name: 'assignedToUserId', type: 'varchar', length: '36', isNullable: true },
        { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
        { name: 'updatedAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' }
      ]
    }))
    await queryRunner.createIndex('tickets', new TableIndex({ name: 'IDX_tickets_customerWaId', columnNames: ['customerWaId'] }))
    await queryRunner.createForeignKey('tickets', new TableForeignKey({
      columnNames: ['assignedToUserId'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'SET NULL', onUpdate: 'CASCADE'
    }))

    // messages
    await queryRunner.createTable(new Table({
      name: 'messages',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'ticketId', type: 'varchar', length: '36', isNullable: false },
        { name: 'direction', type: 'varchar', length: '20', isNullable: false },
        { name: 'body', type: 'text', isNullable: false },
        { name: 'waMessageId', type: 'varchar', length: '255', isNullable: true },
        { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' }
      ]
    }))
    await queryRunner.createIndex('messages', new TableIndex({ name: 'IDX_messages_ticketId', columnNames: ['ticketId'] }))
    await queryRunner.createForeignKey('messages', new TableForeignKey({
      columnNames: ['ticketId'], referencedTableName: 'tickets', referencedColumnNames: ['id'], onDelete: 'CASCADE', onUpdate: 'CASCADE'
    }))

    // attachments
    await queryRunner.createTable(new Table({
      name: 'attachments',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'messageId', type: 'varchar', length: '36', isNullable: false },
        { name: 'mime', type: 'varchar', length: '255', isNullable: false },
        { name: 'filename', type: 'varchar', length: '255', isNullable: false },
        { name: 'path', type: 'varchar', length: '1000', isNullable: false },
        { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' }
      ]
    }))
    await queryRunner.createForeignKey('attachments', new TableForeignKey({
      columnNames: ['messageId'], referencedTableName: 'messages', referencedColumnNames: ['id'], onDelete: 'CASCADE', onUpdate: 'CASCADE'
    }))

    // wa_sessions
    await queryRunner.createTable(new Table({
      name: 'wa_sessions',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'name', type: 'varchar', length: '255', isNullable: false, isUnique: true },
        { name: 'stateJson', type: 'longtext', isNullable: true },
        { name: 'isActive', type: 'tinyint', width: 1, default: 1 },
        { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
        { name: 'updatedAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wa_sessions')
    await queryRunner.dropTable('attachments')
    await queryRunner.dropTable('messages')
    await queryRunner.dropTable('tickets')
    await queryRunner.dropTable('users')
    await queryRunner.dropTable('roles')
  }
}
