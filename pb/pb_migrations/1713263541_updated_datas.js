/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yya8tn9ykw3taig")

  collection.indexes = [
    "CREATE INDEX `idx_xL8aENf` ON `datas` (`task`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yya8tn9ykw3taig")

  collection.indexes = []

  return dao.saveCollection(collection)
})
