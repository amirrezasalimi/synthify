/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9os4tao4aifu931")

  collection.indexes = [
    "CREATE INDEX `idx_XmCSd6X` ON `block_data` (\n  `block_id`,\n  `task`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9os4tao4aifu931")

  collection.indexes = []

  return dao.saveCollection(collection)
})
