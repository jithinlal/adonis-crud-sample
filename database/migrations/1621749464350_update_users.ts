import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name', 255).notNullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('name')
    })
  }
}
