/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e118zkwuzva1wes")

  collection.indexes = [
    "CREATE INDEX `idx_au2oPrD` ON `task_logs` (\n  `type`,\n  `task`,\n  `created`\n)",
    "CREATE INDEX `idx_qQnnO2F` ON `task_logs` (`task`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ncuj6lgj",
    "name": "task",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "o9ef5oes2vz6dng",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e118zkwuzva1wes")

  collection.indexes = [
    "CREATE INDEX `idx_au2oPrD` ON `task_logs` (\n  `type`,\n  `task_id`,\n  `created`\n)",
    "CREATE INDEX `idx_qQnnO2F` ON `task_logs` (`task_id`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ncuj6lgj",
    "name": "task_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "o9ef5oes2vz6dng",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
