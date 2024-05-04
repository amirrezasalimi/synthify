/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e118zkwuzva1wes")

  collection.indexes = [
    "CREATE INDEX `idx_au2oPrD` ON `task_logs` (\n  `type`,\n  `task_id`,\n  `created`\n)",
    "CREATE INDEX `idx_qQnnO2F` ON `task_logs` (`task_id`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zhq6cxue",
    "name": "type",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e118zkwuzva1wes")

  collection.indexes = []

  // remove
  collection.schema.removeField("zhq6cxue")

  return dao.saveCollection(collection)
})
